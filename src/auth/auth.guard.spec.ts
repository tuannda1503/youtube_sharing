import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../config/constants';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow access for public routes', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);
      const context = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as any;

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException if token is missing', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ headers: {} }),
        }),
      } as any;

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ headers: { authorization: 'Bearer invalid_token' } }),
        }),
      } as any;

      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should allow access if token is valid', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ headers: { authorization: 'Bearer valid_token' } }),
        }),
      } as any;

      const payload = { sub: 1, email: 'test@example.com' };
      mockJwtService.verifyAsync.mockResolvedValue(payload);

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException if token format is incorrect', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(false);
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ headers: { authorization: 'invalid_format' } }),
        }),
      } as any;

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });
  });
}); 