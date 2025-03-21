import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;
  let userRepository: Repository<User>;

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mocked_token'),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should register a user successfully and return an access token', async () => {
      const signUpDto = { email: 'test@example.com', password: 'testpass' };
      const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
      mockUserRepository.save.mockResolvedValue({ id: 1, email: signUpDto.email, password: hashedPassword });

      const result = await service.signUp(signUpDto);
      expect(result).toHaveProperty('access_token', 'mocked_token');
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        email: signUpDto.email,
        password: hashedPassword,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 1, email: signUpDto.email });
    });

    it('should handle errors during user registration', async () => {
      const signUpDto = { email: 'test@example.com', password: 'testpass' };
      mockUserRepository.save.mockRejectedValue(new Error('Database error'));

      const result = await service.signUp(signUpDto);
      expect(result).toBeUndefined();
    });
  });

  describe('signIn', () => {
    it('should sign in a user successfully and return an access token', async () => {
      const signInDto = { email: 'test@example.com', password: 'testpass' };
      const user = { id: 1, email: signInDto.email, password: await bcrypt.hash(signInDto.password, 10) };
      mockUserService.findOne.mockResolvedValue(user);

      const result = await service.signIn(signInDto);
      expect(result).toHaveProperty('access_token', 'mocked_token');
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 1, email: signInDto.email });
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const signInDto = { email: 'test@example.com', password: 'wrongpass' };
      const user = { id: 1, email: signInDto.email, password: await bcrypt.hash('testpass', 10) };
      mockUserService.findOne.mockResolvedValue(user);

      await expect(service.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const signInDto = { email: 'nonexistent@example.com', password: 'testpass' };
      mockUserService.findOne.mockResolvedValue(undefined);

      await expect(service.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});