import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostRequestDto } from './dto/post.request.dto';
import { Post as PostEntity } from 'src/entities/post.entity';

@Controller('api/posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getAll(@Query() query): Promise<PostEntity[]> {
    let { page, tagId } = query;

    if (page === null || page === undefined) {
      page = 1;
    }

    // tag가 null인 경우 기본 태그를 설정
    if (tagId === null || tagId === undefined || tagId === '0') {
      tagId = 0;
    }

    const posts = await this.postsService.getByPageAndTag(page, tagId);

    return posts;
  }

  @Get(':postId')
  async getById(@Param() param) {
    const { postId } = param;

    const post = await this.postsService.getById(postId);

    return post;
  }

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
}
