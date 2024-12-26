import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Response } from 'express';
import { ApiTags, ApiConsumes, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadFile(file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all files' })
  async getFiles() {
    return this.filesService.getFiles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Download a file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const { stream, filename, contentType } = await this.filesService.downloadFile(id);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', contentType);
    stream.pipe(res);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  async deleteFile(@Param('id') id: string) {
    return this.filesService.deleteFile(id);
  }
} 