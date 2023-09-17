import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostRequestDto } from './dto/post.request.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getAll(@Query() query) {
    let { page, tagId } = query;

    if (page === null || page === undefined) {
      page = 1; // 기본 페이지 번호 설정
    }

    // tag가 null인 경우 기본 태그를 설정
    if (tagId === null || tagId === undefined) {
      tagId = 0; // 기본 태그 설정 (빈 문자열 또는 다른 기본 값으로 설정 가능)
    }

    const posts = await this.postsService.getByPageAndTag(page, tagId);

    return posts;
  }

  @Post()
  async create(@Body() body: CreatePostRequestDto) {
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
