import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { JwtAuthGuard } from './guards/JwtAuth.guard';
import { OptionalJwtAuthGuard } from './guards/optional-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './JwtStrategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        PassportModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_ACCESS_SECRET,
            signOptions: { expiresIn: '5m' },
        }),
    ],
    providers: [AuthService, JwtAuthGuard, OptionalJwtAuthGuard, PassportModule, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService, JwtAuthGuard, OptionalJwtAuthGuard]
})
export class AuthModule {
}
