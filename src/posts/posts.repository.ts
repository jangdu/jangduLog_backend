import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Post } from 'src/entities/post.entity';
import { Post_Tag } from 'src/entities/post_tag.entity';
import { TagsRepository } from 'src/tags/tags.repository';
import { DataSource, Repository } from 'typeorm';
import { GetPostsDto } from './dto/post.response.dto';

@Injectable()
export class PostsRepository extends Repository<Post> {
  constructor(
    private dataSource: DataSource,
    private tagsRepository: TagsRepository,
  ) {
    super(Post, dataSource.createEntityManager());
  }

  async getByTag(tagId: number): Promise<Post[]> {
    const query = this.createQueryBuilder('post');

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
        .getMany();

      return posts;
    } catch (error) {
      throw new InternalServerErrorException('서버에러');
    }
  }

  async getById(postId: number): Promise<Post> {
    try {
      const post = await this.createQueryBuilder('post')
        .leftJoinAndSelect('post.post_tag', 'post_tag')
        .leftJoinAndSelect('post_tag.tag', 'tag')
        .where('post.id = :id', { id: postId })
        .getOne();

      return post;
    } catch (error) {
      throw new InternalServerErrorException('서버에러');
    }
  }

  async createPost(
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
      throw new InternalServerErrorException('서버의 문제로 인해 실패');
    } finally {
      await queryRunner.release();
    }
    return '포스트가 생성되었습니다.';
  }

  // Update Posts
  async updatePost(
    id: number,
    title: string,
    content: string,
    imgUrl: string,
  ): Promise<Post> {
    try {
      const postToUpdate = await this.findOne({ where: { id } });

      if (!postToUpdate) {
        throw new NotFoundException('수정 할 포스트가 존재하지 않습니다.');
      }

      // 필드 업데이트
      postToUpdate.title = title;
      postToUpdate.content = content;
      postToUpdate.imgUrl = imgUrl;

      await this.save(postToUpdate);
      return postToUpdate;
    } catch (error) {
      throw new InternalServerErrorException('서버의 문제로 인해 실패');
    }
  }

  // Delete Posts
  async deletePost(id: number): Promise<void> {
    try {
      const postToDelete = await this.findOne({ where: { id } });

      if (!postToDelete) {
        throw new NotFoundException('삭제할 포스트를 찾을 수 없습니다.');
      }

      await this.remove(postToDelete);
    } catch (error) {
      throw new InternalServerErrorException(
        '포스트 삭제 중에 오류가 발생했습니다.',
      );
    }
  }
}
