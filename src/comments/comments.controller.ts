import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateCommentsRequestDto } from './dto/comment.request.dto';
import { GetAllCommentsResponseDto } from './dto/comment.response.dto';
import { Comment } from 'src/entities/comment.entity';
import { postIdParamDto } from 'src/dto/post.id.param.dto';

@ApiTags('Comments')
@Controller('api/posts/:postId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @ApiOperation({ summary: '포스트 내의 코멘트 조회' })
  @ApiParam({
    name: 'postId',
    required: false,
    description: '포스트 ID',
  })
  @Get()
  async getByPostId(@Param() param: postIdParamDto): Promise<Comment[]> {
    const { postId } = param;

    const comments = await this.commentsService.getByPostId(postId);

    return comments;
  }

  @ApiOperation({ summary: '댓글 생성' })
  @ApiParam({
    name: 'postId',
    required: false,
    description: '포스트 ID',
  })
  @Post()
  async create(
    @Body() body: CreateCommentsRequestDto,
    @Param() param: postIdParamDto,
  ): Promise<string> {
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
