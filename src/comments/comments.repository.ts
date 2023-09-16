import { Injectable } from '@nestjs/common';
import { Comment } from 'src/entities/comment.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommentsRepository extends Repository<Comment> {
  constructor(private datasource: DataSource) {
    super(Comment, datasource.createEntityManager());
  }
}
