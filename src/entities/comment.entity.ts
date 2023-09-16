import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common.entity';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from './post.entity';

@Entity({ schema: '', name: 'comment' })
export class Comment extends CommonEntity {
  @IsString()
  @ApiProperty({
    example: '댓글 내용 123',
    description: '댓글 내용',
    required: true,
  })
  @Column('varchar')
  content: string;

  @IsString()
  @ApiProperty({
    example: 'jjd0324@gmail.com',
    description: 'email',
    required: true,
  })
  @Column('varchar')
  email: string;

  @IsString()
  @ApiProperty({
    example: '123456',
    description: 'password',
    required: true,
  })
  @Column('varchar')
  password: string;

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

  @ManyToOne(() => Post, (post) => post.comment)
  @JoinColumn([{ name: 'postId', referencedColumnName: 'id' }])
  post: Post;
}
