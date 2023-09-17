import { Column, ManyToOne, Entity, JoinColumn } from 'typeorm';
import { CommonEntity } from './common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Post } from './post.entity';
import { Tag } from './tag.entity';

@Entity({ schema: '', name: 'post_tag' })
export class Post_Tag extends CommonEntity {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'tagId',
    required: true,
  })
  @Column({
    type: 'bigint',
  })
  tagId: number;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'postId',
    required: true,
  })
  @Column({
    type: 'bigint',
  })
  postId: number;

  @ManyToOne(() => Post, (post) => post.post_tag)
  @JoinColumn([{ name: 'postId', referencedColumnName: 'id' }])
  post: Post;

  @ManyToOne(() => Tag, (tag) => tag.post_tag)
  @JoinColumn([{ name: 'tagId', referencedColumnName: 'id' }])
  tag: Tag;
}
