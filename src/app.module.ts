import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BloggersPlatformModule,
  UserAccountsModule,
  NotificationsModule,
  TestingModule,
} from './modules';

@Module({
  imports: [
    //TODO: move url and dbName to .env
    MongooseModule.forRoot(process.env.MONGO_URL!, {
      dbName: 'nest-bloggers-platform-mongodb',
    }),
    BloggersPlatformModule,
    UserAccountsModule,
    NotificationsModule,
    TestingModule,
  ],
})
export class AppModule {}
