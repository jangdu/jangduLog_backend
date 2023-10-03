import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  CreatePostRequestDto,
  UpdatePostRequestDto,
} from './dto/post.request.dto';
import { Post as PostEntity } from 'src/entities/post.entity';
import { GetAllPostsDto } from './dto/post.response.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { postIdParamDto } from 'src/dto/post.id.param.dto';

@ApiTags('Posts')
@Controller('api/posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiOperation({ summary: '전체 포스트 조회' })
  @ApiQuery({
    name: 'tagId',
    required: false,
    description: '태그 아이디',
  })
  @Get()
  async getAll(@Query() query): Promise<PostEntity[]> {
    let { page, tagId } = query;

    if (page === null || page === undefined) {
      page = 1;
    }
    if (tagId === null || tagId === undefined || tagId === '0') {
      tagId = 0;
    }

    const posts = await this.postsService.getByPageAndTag(page, tagId);

    return posts;
  }

  @ApiOperation({ summary: '포스트 id로 글 검색' })
  @ApiParam({ name: 'postId', description: 'post id', required: true })
  @Get(':postId')
  async getById(@Param() param: postIdParamDto): Promise<GetAllPostsDto> {
    const { postId } = param;

    const post = await this.postsService.getById(postId);

    return post;
  }

  @ApiOperation({ summary: '포스트 생성' })
  @Post()
  async create(@Body() body: CreatePostRequestDto): Promise<string> {
    const { title, content, imgUrl, tagList } = body;

    const createdMessage = await this.postsService.create(
      title,
      content,
      imgUrl,
      tagList,
    );

    return createdMessage;
  }

  // Update Posts
  @ApiOperation({ summary: '포스트 수정' })
  @ApiParam({ name: 'postId', description: 'post id', required: true })
  @Patch(':postId')
  async update(
    @Param() param: postIdParamDto,
    @Body() body: UpdatePostRequestDto,
  ): Promise<string> {
    const { postId } = param;
    const { title, content, imgUrl } = body;

    const updatedMessage = await this.postsService.updatePost(
      postId,
      title,
      content,
      imgUrl,
    );

    return updatedMessage;
  }

  @ApiOperation({ summary: '포스트 삭제' })
  @ApiParam({
    name: 'postId',
    description: '삭제할 포스트의 ID',
    required: true,
  })
  @Delete(':postId')
  async delete(@Param() param: postIdParamDto): Promise<string> {
    const { postId } = param;

    const deletedMessage = await this.postsService.deletePost(postId);

    return deletedMessage;
  }
}
