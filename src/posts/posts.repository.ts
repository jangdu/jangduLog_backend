import { Injectable } from '@nestjs/common';
import { Post } from 'src/entities/post.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PostsRepository extends Repository<Post> {
  constructor(private datasource: DataSource) {
    super(Post, datasource.createEntityManager());
  }
}
