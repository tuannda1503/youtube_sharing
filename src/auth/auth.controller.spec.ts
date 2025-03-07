import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn().mockResolvedValue({ access_token: 'mocked_token' }),
            signIn: jest.fn().mockResolvedValue({ access_token: 'mocked_token', email: 'test@example.com' }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call AuthService.signUp and return its result', async () => {
      const signUpDto: SignUpDto = { email: 'test@example.com', password: 'testpass' };
      const result = await controller.signUp(signUpDto);
      expect(service.signUp).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual({ access_token: 'mocked_token' });
    });

    it('should handle errors during signUp', async () => {
      const signUpDto: SignUpDto = { email: 'test@example.com', password: 'testpass' };
      service.signUp = jest.fn().mockRejectedValue(new Error('Registration error'));

      await expect(controller.signUp(signUpDto)).rejects.toThrow('Registration error');
    });
  });

  describe('signIn', () => {
    it('should call AuthService.signIn and return its result', async () => {
      const signInDto: SignInDto = { email: 'test@example.com', password: 'testpass' };
      const result = await controller.signIn(signInDto);
      expect(service.signIn).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual({ access_token: 'mocked_token', email: 'test@example.com' });
    });

    it('should handle errors during signIn', async () => {
      const signInDto: SignInDto = { email: 'test@example.com', password: 'testpass' };
      service.signIn = jest.fn().mockRejectedValue(new Error('Sign-in error'));

      await expect(controller.signIn(signInDto)).rejects.toThrow('Sign-in error');
    });
  });
});
