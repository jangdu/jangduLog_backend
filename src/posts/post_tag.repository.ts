import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Post_Tag } from 'src/entities/post_tag.entity';

import { DataSource, Repository } from 'typeorm';

@Injectable()
export class Post_TagsRepository extends Repository<Post_Tag> {
  constructor(private datasource: DataSource) {
    super(Post_Tag, datasource.createEntityManager());
  }

  async findByPostId(postId: number): Promise<Post_Tag[]> {
    try {
      console.log('들어옴');
      const post_Tag = await this.find({ where: { postId } });

      return post_Tag;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '포스트 삭제 중에 오류가 발생했습니다.',
      );
    }
  }

  async deleteByPostId(postId: number) {
    try {
      const post_Tag = await this.findByPostId(postId);

      if (!post_Tag) {
        throw new NotFoundException('삭제할 포스트를 찾을 수 없습니다.');
      }

      await this.remove(post_Tag);
    } catch (error) {
      throw new InternalServerErrorException(
        '포스트 삭제 중에 오류가 발생했습니다.',
      );
    }
  }
}
