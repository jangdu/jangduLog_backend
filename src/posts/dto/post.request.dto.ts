import { ApiProperty, PickType } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';
import { Post } from 'src/entities/post.entity';

export class CreatePostRequestDto extends PickType(Post, [
  'title',
  'content',
  'imgUrl',
]) {
  @IsArray({ message: '태그 리스트는 배열이어야 합니다.' })
  @ArrayNotEmpty({ message: '태그리스트는 한개 이상이어야 합니다.' })
  @IsString({ each: true, message: '태그는 문자열이어야 합니다.' })
  @ApiProperty({
    example: ['javascript', 'typescript'],
    description: '태그 리스트',
    required: true,
  })
  tagList: string[];
}
export class UpdatePostRequestDto extends PickType(Post, [
  'title',
  'content',
  'imgUrl',
]) {}
