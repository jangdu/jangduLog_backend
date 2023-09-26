import { TagsRepository } from './../tags/tags.repository';
import {
  BadGatewayException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { DataSource } from 'typeorm';
import { Post } from 'src/entities/post.entity';
import { Post_Tag } from 'src/entities/post_tag.entity';
import { RedisClientType } from 'redis';

@Injectable()
export class PostsService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
    private postsRepository: PostsRepository,
    private tagsRepository: TagsRepository,
    private dataSource: DataSource,
  ) {}

  async getByPageAndTag(page, tagId): Promise<Post[]> {
    const postsPerPage = 10; // 페이지당 게시물 수
    const skip = (page - 1) * postsPerPage;

    const query = this.postsRepository.createQueryBuilder('post');

    // 모든 태그 정보 가져오기
    query.leftJoinAndSelect('post.post_tag', 'post_tag');

    if (tagId) {
      // 태그 필터링을 추가
      query.where('post_tag.tagId = :tagId', { tagId });
    }

    try {
      const posts = await query
        .orderBy('post.createdAt', 'DESC')
        .select([
          'post.id',
          'post.createdAt',
          'post.updatedAt',
          'post.title',
          'post.imgUrl',
          'post_tag.tag',
        ])
        .skip(skip)
        .take(postsPerPage)
        .getMany();

      return posts;
    } catch (error) {
      throw new InternalServerErrorException('서버에러');
    }
  }

  async getById(postId) {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.post_tag', 'post_tag')
      .leftJoinAndSelect('post_tag.tag', 'tag')
      .leftJoinAndSelect('post.comment', 'comment')
      .where('post.id = :id', { id: postId })
      .getOne();

    const views = await this.incrementPostViews(postId);

    console.log(views);

    return { ...post, views };
  }

  async create(title, content, imgUrl, tagList): Promise<string> {
    // console.log(newTagList);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdPost = await queryRunner.manager.getRepository(Post).save({
        title,
        content,
        imgUrl,
      });

      const newTagList = await Promise.all(
        tagList.map(async (tag) => {
          const newTag = await this.tagsRepository.findOrCreateTag(tag);

          const newPostTag = await queryRunner.manager
            .getRepository(Post_Tag)
            .insert({
              postId: createdPost.id,
              tagId: newTag.id,
            });
        }),
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadGatewayException(`서버에러 messege: ${error}`);
    } finally {
      await queryRunner.release();
    }

    return '포스트가 생성되었습니다.';
    // return newTagList;
  }

  // 레디스 조회수 올려주기
  async incrementPostViews(postId: number): Promise<number> {
    console.log('들어오긴 했음');
    const redisKey = `post:${postId}:views`;
    // 레디스에서 현재 조회수 가져오기
    const currentViews = await this.redis.get(redisKey);

    // 조회수가 없으면 1로 초기값 설정
    const newViews = currentViews ? parseInt(currentViews) + 1 : 1;

    // 레디스에 조회수 업데이트
    await this.redis.set(redisKey, newViews);

    return newViews;
  }
}
