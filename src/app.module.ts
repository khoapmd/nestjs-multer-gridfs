import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:62553/fs'),
    FilesModule,
  ],
})
export class AppModule {}
