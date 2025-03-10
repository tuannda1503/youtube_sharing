import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { AuthGuard } from '../auth/auth.guard';
import { ShareMovieDto } from './dto/share-movie.dto';
import { Movie } from './entity/movie.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('MovieController', () => {
  let controller: MovieController;
  let movieService: MovieService;

  const mockMovieService = {
    find: jest.fn(),
    shareMovie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: mockMovieService,
        },
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    movieService = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const result: Movie[] = [{ id: 1, title: 'Inception' } as Movie];
      jest.spyOn(movieService, 'find').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });

    it('should handle empty movie list', async () => {
      jest.spyOn(movieService, 'find').mockResolvedValue([]);

      const result = await controller.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('shareMovie', () => {
    it('should share a movie successfully when user is authenticated', async () => {
      const req = { user: { sub: 1, email: 'test@example.com' } };
      const dto: ShareMovieDto = { url: 'http://example.com', userId: req.user.sub, email: req.user.email };
      jest.spyOn(movieService, 'shareMovie').mockResolvedValue(true);

      const result = await controller.shareMovie(dto.url, req);
      expect(result).toBe(true);
      expect(movieService.shareMovie).toHaveBeenCalledWith(dto);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const req = { user: null }; // Simulate unauthenticated user
      const dto: ShareMovieDto = { url: 'http://example.com', userId: null, email: null };

      await expect(controller.shareMovie(dto.url, req)).rejects.toThrow(UnauthorizedException);
    });

    it('should handle errors when sharing a movie', async () => {
      const req = { user: { sub: 1, email: 'test@example.com' } };
      const dto: ShareMovieDto = { url: 'http://example.com', userId: req.user.sub, email: req.user.email };
      jest.spyOn(movieService, 'shareMovie').mockRejectedValue(new Error('Error sharing movie'));

      await expect(controller.shareMovie(dto.url, req)).rejects.toThrow(Error);
    });
  });
});
