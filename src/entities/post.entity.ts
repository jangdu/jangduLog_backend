import { OneToMany, Column, Entity } from 'typeorm';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from './common.entity';
import { Post_Tag } from './post_tag.entity';
import { Comment } from './comment.entity';

@Entity({ schema: '', name: 'post' })
export class Post extends CommonEntity {
  @IsString()
  @ApiProperty({
    example: '첫번째 포스트이름',
    description: '게시글 제목',
    required: true,
  })
  @Column('varchar')
  title: string;

  @IsString()
  @ApiProperty({
    example: '포스트 글',
    description: '게시글 내용',
    required: true,
  })
  @Column('mediumtext')
  content: string;

  @IsString()
  @ApiProperty({
    example: 'url',
    description: '게시글 이미지',
    required: true,
  })
  @Column('varchar')
  imgUrl: string;

  @OneToMany(() => Post_Tag, (post_tag) => post_tag.post)
  post_tag: Post_Tag[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comment: Comment[];
}
