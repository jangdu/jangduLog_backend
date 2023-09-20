import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './common.entity';
import { Post_Tag } from './post_tag.entity';

@Entity({ schema: '', name: 'tag' })
export class Tag  {
  @ApiProperty({
    name: 'id',
    description: 'Primary key as Entity id',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @ApiProperty({
    example: 'javascript',
    description: '테그 이름',
    required: true,
  })
  @Column('varchar')
  name: string;

  @OneToMany(() => Post_Tag, (post_tag) => post_tag.tag)
  post_tag: Post_Tag[];
}
