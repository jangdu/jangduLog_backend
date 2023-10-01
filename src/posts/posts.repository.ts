import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Post } from 'src/entities/post.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PostsRepository extends Repository<Post> {
  constructor(private datasource: DataSource) {
    super(Post, datasource.createEntityManager());
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
}
