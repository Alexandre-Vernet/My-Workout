import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { AuthGuard } from './auth.guard';
import { OptionalAuthGuard } from "./optional-auth.guard";

@Module({
  imports: [
      TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [AuthService, AuthGuard, OptionalAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard, OptionalAuthGuard]
})
export class AuthModule  {
}
