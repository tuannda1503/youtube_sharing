import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service';
import { User } from '../user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../config/constants';

@Module({
  imports: [TypeOrmModule.forFeature([User]), 
  JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '6000s' },
  }),
  UserModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
