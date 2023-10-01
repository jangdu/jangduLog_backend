import { TagsRepository } from './../tags/tags.repository';
import {
  BadGatewayException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { DataSource } from 'typeorm';
import { Post } from 'src/entities/post.entity';
import { Post_Tag } from 'src/entities/post_tag.entity';
import { RedisClientType } from 'redis';
import { GetAllPostsDto } from './dto/post.response.dto';

@Injectable()
export class PostsService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
    private postsRepository: PostsRepository,
    private tagsRepository: TagsRepository,
    private dataSource: DataSource,
  ) {}

  // GET AllPost
  async getByPageAndTag(page: number, tagId: number): Promise<Post[]> {
    const postsPerPage = 50; // 페이지당 게시물 수
    const skip = (page - 1) * postsPerPage;

    const query = this.postsRepository.createQueryBuilder('post');

    query.leftJoinAndSelect('post.post_tag', 'post_tag');

    if (tagId) {
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

      if (!posts) {
        throw new NotFoundException('포스트를 찾을 수 없습니다.');
      }

      return posts;
    } catch (error) {
      throw new InternalServerErrorException('서버에러');
    }
  }

  // GET ByPostId
  async getById(postId: number): Promise<GetAllPostsDto> {
    try {
      const post = await this.postsRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.post_tag', 'post_tag')
        .leftJoinAndSelect('post_tag.tag', 'tag')
        .where('post.id = :id', { id: postId })
        .getOne();

      if (!post) {
        throw new NotFoundException('해당 포스트를 찾을 수 없습니다.');
      }

      const views = await this.incrementPostViews(postId);

      return { post, views };
    } catch (error) {
      throw new InternalServerErrorException('서버에러');
    }
  }

  // CREATE Post
  async create(
    title: string,
    content: string,
    imgUrl: string,
    tagList: string[],
  ): Promise<string> {
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
  }

  // 레디스 조회수 올려주기
  async incrementPostViews(postId: number): Promise<number> {
    const redisKey = `post:${postId}:views`;

    const currentViews = await this.redis.get(redisKey);

    const newViews = currentViews ? parseInt(currentViews) + 1 : 1;

    await this.redis.set(redisKey, newViews);

    return newViews;
  }

  // 모든 포스트 조회 수 키 가져오기
  async getPopularPosts(): Promise<Post[]> {
    const postIds = await this.redis.keys('post:*:views');

    // 조회 수가 높은 순으로 정렬
    postIds.sort((a, b) => {
      const viewsA = parseInt(a.split(':')[1]);
      const viewsB = parseInt(b.split(':')[1]);
      return viewsB - viewsA;
    });

    const popularPosts = await Promise.all(
      postIds.map(async (postId) => {
        const postIdNum = parseInt(postId.split(':')[1]);
        return await this.postsRepository.findOne({ where: { id: postIdNum } }); // 데이터베이스에서 포스트 정보 가져오기
      }),
    );

    return popularPosts;
  }

  // Update Posts
  async updatePost(
    id: number,
    title: string,
    content: string,
    imgUrl: string,
  ): Promise<string> {
    try {
      const updatedPost = await this.postsRepository.updatePost(
        id,
        title,
        content,
        imgUrl,
      );

      if (updatedPost) {
        return '포스트가 업데이트되었습니다.';
      }
    } catch (error) {
      throw new InternalServerErrorException('서버의 문제로 인해 실패');
    }
  }

  // 포스트 삭제
  async deletePost(postId: number): Promise<string> {
    try {
      const deletedPost = await this.postsRepository.findOne({
        where: { id: postId },
      });

      if (!deletedPost) {
        throw new NotFoundException('삭제할 포스트를 찾을 수 없습니다.');
      }

      await this.postsRepository.remove(deletedPost);

      return '포스트가 삭제되었습니다.';
    } catch (error) {
      throw new InternalServerErrorException('서버의 문제로 인해 실패');
    }
  }
}
