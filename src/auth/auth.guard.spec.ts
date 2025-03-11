import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    jwtService = new JwtService();
    reflector = new Reflector();
    authGuard = new AuthGuard(jwtService, reflector);

    // Mock ExecutionContext
    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should allow access if the route is public', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const result = await authGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
      expect.anything(),
      [mockContext.getHandler(), mockContext.getClass()],
    );
  });

  it('should deny access if no token is provided', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    jest
      .spyOn(mockContext.switchToHttp(), 'getRequest')
      .mockReturnValue({ headers: {} });

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should deny access if token is invalid', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    jest.spyOn(mockContext.switchToHttp(), 'getRequest').mockReturnValue({
      headers: { authorization: 'Bearer invalid_token' },
    });
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockRejectedValue(new Error('Invalid token'));

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should allow access and attach user to request if token is valid', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const mockPayload = { userId: 1, email: 'test@example.com' };

    const mockRequest = {
      headers: { authorization: 'Bearer valid_token' },
    };
    jest
      .spyOn(mockContext.switchToHttp(), 'getRequest')
      .mockReturnValue(mockRequest);
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);

    const result = await authGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest['user']).toEqual(mockPayload);
  });
});
