import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostRequestDto } from './dto/post.request.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getAll() {
    return 'getAll posts';
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
