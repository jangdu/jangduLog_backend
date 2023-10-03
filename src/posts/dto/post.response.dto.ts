import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/entities/post.entity';

export class PostDto {}

export class GetPostsDto {
  @ApiProperty({
    type: Post,
  })
  readonly post: object;

  @ApiProperty({
    type: Number,
  })
  readonly views: number;
}
