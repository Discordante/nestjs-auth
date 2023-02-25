import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, IamModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
