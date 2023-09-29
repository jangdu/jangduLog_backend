import { ApiProperty } from '@nestjs/swagger';

export class postIdParamDto {
  @ApiProperty({
    example: 2,
    description: 'postId',
    required: true,
  })
  postId: number;
}
