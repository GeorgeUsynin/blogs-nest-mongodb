import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountsModule } from './modules';

@Module({
  imports: [
    //TODO: move url and dbName to .env
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'nest-bloggers-platform-mongodb',
    }),
    UserAccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
