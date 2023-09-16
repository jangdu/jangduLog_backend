import { CommentsRepository } from './comments.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}
}
