import { ApiProperty, PickType } from '@nestjs/swagger';
import { Comment } from 'src/entities/comment.entity';

export class PostDto {}

export class GetAllCommentsResponseDto {
  @ApiProperty({
    type: Comment,
  })
  readonly data: object;
}
