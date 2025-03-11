import { Test, TestingModule } from '@nestjs/testing';
import { ShareGateway } from './gateway';
import { Server } from 'socket.io';

describe('ShareGateway', () => {
  let gateway: ShareGateway;
  let mockServer: Server & { on: jest.Mock; emit: jest.Mock };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShareGateway],
    }).compile();

    gateway = module.get<ShareGateway>(ShareGateway);
    mockServer = {
      on: jest.fn(),
      emit: jest.fn(),
    } as unknown as Server & { on: jest.Mock; emit: jest.Mock };

    gateway.server = mockServer;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should log connection on module init', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    gateway.onModuleInit();
    expect(mockServer.on).toHaveBeenCalledWith('connect', expect.any(Function));
    // Simulate a connection
    const connectCallback = mockServer.on.mock.calls[0][1];
    connectCallback({ id: 'test-socket-id' });

    expect(consoleSpy).toHaveBeenCalledWith('test-socket-id');
    expect(consoleSpy).toHaveBeenCalledWith('Connected to server');

    consoleSpy.mockRestore();
  });

  it('should emit new message when receiving new message', () => {
    const mockServer = {
      emit: jest.fn(),
    } as unknown as Server;

    gateway.server = mockServer;

    const message = { content: 'Test message' };
    gateway.onNewMessage(message);

    expect(mockServer.emit).toHaveBeenCalledWith('onMessage', {
      msg: 'New Message',
      content: message,
    });
  });

  it('should emit message when sharing movie', () => {
    const mockServer = {
      emit: jest.fn(),
    } as unknown as Server;

    gateway.server = mockServer;

    const movie = { title: 'Test movie', description: 'Test description' };
    gateway.sharedMovie(movie);

    expect(mockServer.emit).toHaveBeenCalledWith('onMessage', { body: movie });
  });
});
