import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { UserAccountsModule } from '../user-accounts';
import { BloggersPlatformModule } from '../bloggers-platform';

@Module({
  imports: [BloggersPlatformModule, UserAccountsModule],
  controllers: [TestingController],
})
export class TestingModule {}
