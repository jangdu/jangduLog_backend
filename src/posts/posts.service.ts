import { TagsRepository } from './../tags/tags.repository';
import { BadGatewayException, Injectable } from '@nestjs/common';
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

  async getByPageAndTag(page, tagId) {
    const postsPerPage = 10; // 페이지당 게시물 수
    const skip = (page - 1) * postsPerPage;
    console.log(tagId);

    const query = this.postsRepository.createQueryBuilder('post');

    // 모든 태그 정보 가져오기
    query
      .leftJoinAndSelect('post.post_tag', 'post_tag')
      .leftJoinAndSelect('post_tag.tag', 'tag');

    if (tagId) {
      // 태그 필터링을 추가
      query.where('post_tag.tagId = :tagId', { tagId });
    }

    const posts = await query
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(postsPerPage)
      .getMany();

    return posts;
  }

  async getById(postId) {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.post_tag', 'post_tag')
      .leftJoinAndSelect('post_tag.tag', 'tag')
      .where('post.id = :id', { id: postId })
      .getOne();

    console.log(post);

    return post;
  }

  async create(title, content, imgUrl, tagList) {
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
      // await queryRunner.manager.getRepository(UserEntity).save(user);

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
