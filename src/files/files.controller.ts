import { Post, Get, Param, Res, Controller, UseInterceptors, UseGuards, UploadedFiles, HttpException, HttpStatus } from '@nestjs/common';
import { ApiCreatedResponse, ApiConsumes, ApiBody, ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { ApiException } from '../shared/api-exception.model';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileResponseVm } from './view-models/file-response-vm.model'

@Controller('/files')
@ApiTags('Files')
export class FilesController {
    constructor(private filesService: FilesService){}
    @Post('')
    @ApiConsumes('multipart/form-data')
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
    @UseInterceptors(FilesInterceptor('file'))
    upload(@UploadedFiles() files) {
        const response = [];
        files.forEach(file => {
            const fileReponse = {
                originalname: file.originalname,
                encoding: file.encoding,
                mimetype: file.mimetype,
                id: file.id,
                filename: file.filename,
                metadata: file.metadata,
                bucketName: file.bucketName,
                chunkSize: file.chunkSize,
                size: file.size,
                md5: file.md5,
                uploadDate: file.uploadDate,
                contentType: file.contentType,
            };
            response.push(fileReponse);
        });
        return response;
    }

    @Get('info/:id')
    @ApiBadRequestResponse({ type: ApiException })
    async getFileInfo(@Param('id') id: string): Promise<FileResponseVm> {        
        const file = await this.filesService.findInfo(id)
        const filestream = await this.filesService.readStream(id)
        if(!filestream){
            throw new HttpException('An error occurred while retrieving file info', HttpStatus.EXPECTATION_FAILED)
        }
        return {
            message: 'File has been detected',
            file: file
        }
    }

    @Get(':id')
    @ApiBadRequestResponse({ type: ApiException })
    async getFile(@Param('id') id: string, @Res() res) {        
        const file = await this.filesService.findInfo(id)
        const filestream = await this.filesService.readStream(id)
        if(!filestream){
            throw new HttpException('An error occurred while retrieving file', HttpStatus.EXPECTATION_FAILED)
        }
        res.header('Content-Type', file.contentType);
        return filestream.pipe(res)
    }

    @Get('download/:id')
    @ApiBadRequestResponse({ type: ApiException })
    async downloadFile(@Param('id') id: string, @Res() res) {
        const file = await this.filesService.findInfo(id)        
        const filestream = await this.filesService.readStream(id)
        if(!filestream){
            throw new HttpException('An error occurred while retrieving file', HttpStatus.EXPECTATION_FAILED)
        } 
        res.header('Content-Type', file.contentType);
        res.header('Content-Disposition', 'attachment; filename=' + file.filename);
        return filestream.pipe(res) 
    }

    @Get('delete/:id')
    @ApiBadRequestResponse({ type: ApiException })
    @ApiCreatedResponse({ type: FileResponseVm })
    async deleteFile(@Param('id') id: string): Promise<FileResponseVm> {
        const file = await this.filesService.findInfo(id)
        const filestream = await this.filesService.deleteFile(id)
        if(!filestream){
            throw new HttpException('An error occurred during file deletion', HttpStatus.EXPECTATION_FAILED)
        }        
        return {
            message: 'File has been deleted',
            file: file
        }
    }
}