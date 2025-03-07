import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';


@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UserService
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<any> {
    const { email, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    try {
      const user = await this.userRepository.save({
        email,
        password: hashedPassword,
      });
      return {
        access_token: await this.jwtService.signAsync({
          sub: user.id,
          email: user.email,
        }),
      };
    } catch (error) {
      console.log(error);
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ access_token: string; email: string }> {
    const { email, password } = signInDto;
    const user = await this.userService.findOne(email);
    const payload = { sub: user.id, email: user.email };
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      throw new UnauthorizedException();
    }
    return {
      access_token: await this.jwtService.signAsync(payload),
      email,
    };
  }
}
