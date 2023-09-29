import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Tags')
@Controller('api/tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @ApiOperation({ summary: '전체 태그 조회' })
  @Get()
  async getAll() {
    const tags = this.tagsService.getAll();

    return tags;
  }
}
