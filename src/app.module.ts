import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule  } from './files/files.module'
import { MongooseModule } from '@nestjs/mongoose';
require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    FilesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
