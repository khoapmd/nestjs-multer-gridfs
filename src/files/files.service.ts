import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';

@Injectable()
export class FilesService {
  private bucket: GridFSBucket;

  constructor(@InjectConnection() private connection: Connection) {
    this.bucket = new GridFSBucket(this.connection.db);
  }

  async uploadFile(file: Express.Multer.File) {
    const uploadStream = this.bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });

    return new Promise((resolve, reject) => {
      const bufferStream = require('stream').Readable.from(file.buffer);
      bufferStream.pipe(uploadStream)
        .on('error', reject)
        .on('finish', () => {
          resolve({
            id: uploadStream.id,
            filename: file.originalname,
            contentType: file.mimetype,
            size: file.size,
          });
        });
    });
  }

  async getFiles() {
    const files = await this.bucket.find().toArray();
    return files;
  }

  async downloadFile(id: string) {
    try {
      // First get the file info to access the filename
      const files = await this.bucket.find({ _id: new ObjectId(id) }).toArray();
      if (!files.length) {
        throw new NotFoundException('File not found');
      }

      const downloadStream = this.bucket.openDownloadStream(new ObjectId(id));
      return {
        stream: downloadStream,
        filename: files[0].filename,  // Original filename with extension
        contentType: files[0].contentType
      };
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }

  async deleteFile(id: string) {
    try {
      await this.bucket.delete(new ObjectId(id));
      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }
} 