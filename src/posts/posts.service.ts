import { TagsRepository } from './../tags/tags.repository';
import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { DataSource } from 'typeorm';
import { Post } from 'src/entities/post.entity';
import { Post_Tag } from 'src/entities/post_tag.entity';

@Injectable()
export class PostsService {
  constructor(
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

    return post;
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
}
