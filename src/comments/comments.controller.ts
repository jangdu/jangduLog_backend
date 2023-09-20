import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('/posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  async getByPostId(@Param() param) {
    const { postId } = param;

    const comments = await this.commentsService.getByPostId(postId);

    return comments;
  }

  @Post()
  async create(@Body() body, @Param() param) {
    const { postId } = param;
    const { content, email, password } = body;

    const createdComment = this.commentsService.create(
      postId,
      content,
      email,
      password,
    );

    return '댓글생성 완료!';
  }
}
