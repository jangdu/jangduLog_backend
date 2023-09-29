import { CommentsRepository } from './comments.repository';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Comment } from 'src/entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}

  async getByPostId(postId): Promise<Comment[]> {
    const comments = await this.commentsRepository.find({ where: { postId } });

    return comments;
  }

  async create(postId, content, email, password) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    // const isMatch = await bcrypt.compare('1234', hash);

    const createdComment = await this.commentsRepository.save({
      postId,
      content,
      email,
      password: hash,
    });

    return createdComment;
  }
}
