import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostRequestDto } from './dto/post.request.dto';
import { Post as PostEntity } from 'src/entities/post.entity';

@Controller('api/ranks')
export class RanksController {
  constructor(private postsService: PostsService) {}

  @Get()
  async getAll(@Query() query): Promise<PostEntity[]> {
    const posts = await this.postsService.getPopularPosts();

    return posts;
  }
}
