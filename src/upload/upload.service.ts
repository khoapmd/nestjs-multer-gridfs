import { Injectable } from '@nestjs/common';
import { MongoClient, GridFSBucket } from 'mongodb';
import * as multer from 'multer';

@Injectable()
export class UploadService {
  private bucket: GridFSBucket;

  constructor() {
    const client = new MongoClient('mongodb://localhost:62553');
    const db = client.db('fs');
    this.bucket = new GridFSBucket(db);
  }

  async uploadFile(file: Express.Multer.File) {
    const uploadStream = this.bucket.openUploadStream(file.originalname);
    
    return new Promise((resolve, reject) => {
      const bufferStream = require('stream').Readable.from(file.buffer);
      bufferStream.pipe(uploadStream)
        .on('error', reject)
        .on('finish', () => {
          resolve(uploadStream.id);
        });
    });
  }
} 