import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
require('dotenv').config();
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const url = process.env.MONGO_URL

@Injectable()
export class GridFsMulterConfigService implements MulterOptionsFactory {
    private gridFsStorage: typeof GridFsStorage;
    constructor() {
        this.gridFsStorage = new GridFsStorage({
            url: url,
            file: (req, file) => {
                return new Promise((resolve, reject) => {
                    const filename = file.originalname.trim();
                    const fileInfo = {
                      filename: filename
                    };
                    resolve(fileInfo);
                });
              }
        });
    }

    createMulterOptions(): MulterModuleOptions {
        return {
            storage: this.gridFsStorage,
        };
    }
}