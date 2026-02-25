import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloggersPlatformModule, UserAccountsModule } from './modules';

@Module({
  imports: [
    //TODO: move url and dbName to .env
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'nest-bloggers-platform-mongodb',
    }),
    BloggersPlatformModule,
    UserAccountsModule,
  ],
})
export class AppModule {}
