import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import {
  CreatebookmarkDto,
  EditbookmarkDto,
} from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(
    private bookmarkService: BookmarkService,
  ) {}

  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(
      userId,
    );
  }

  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe)
    boookmarkID: number,
  ) {
    return this.bookmarkService.getBookmarkById(
      userId,
      boookmarkID,
    );
  }

  @Post()
  createBookark(
    @GetUser('id') userId: number,
    @Body() dto: CreatebookmarkDto,
  ) {
    return this.bookmarkService.createBookark(
      userId,
      dto,
    );
  }

  @Patch(':id')
  editBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe)
    boookmarkID: number,
    @Body() dto: EditbookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(
      userId,
      boookmarkID,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe)
    boookmarkID: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(
      userId,
      boookmarkID,
    );
  }
}
