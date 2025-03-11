import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { Movie } from './entity/movie.entity';
import { ShareMovieDto } from './dto/share-movie.dto';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

describe('MovieController', () => {
  let movieController: MovieController;
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
        AuthGuard,
        JwtService,
        Reflector,
      ],
    }).compile();

    movieController = module.get<MovieController>(MovieController);
    movieService = module.get<MovieService>(MovieService);
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const movies: Movie[] = [
        { id: 1, title: 'Movie 1', url: 'https://example.com', userId: 123 },
      ];
      jest.spyOn(movieService, 'find').mockResolvedValue(movies);

      const result = await movieController.findAll();

      expect(result).toEqual(movies);
      expect(movieService.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if movieService.find fails', async () => {
      jest
        .spyOn(movieService, 'find')
        .mockRejectedValue(new Error('Database error'));

      await expect(movieController.findAll()).rejects.toThrow('Database error');
      expect(movieService.find).toHaveBeenCalledTimes(2);
    });
  });

  describe('shareMovie', () => {
    it('should return true when a movie is shared successfully', async () => {
      const reqMock = { user: { sub: 123, email: 'user@example.com' } };
      const url = 'https://example.com/movie';
      const shareDto: ShareMovieDto = {
        url,
        userId: 123,
        email: 'user@example.com',
      };

      jest.spyOn(movieService, 'shareMovie').mockResolvedValue(true);

      const result = await movieController.shareMovie(url, reqMock);

      expect(result).toBe(true);
      expect(movieService.shareMovie).toHaveBeenCalledWith(shareDto);
      expect(movieService.shareMovie).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if movieService.shareMovie fails', async () => {
      const reqMock = { user: { sub: 'user123', email: 'user@example.com' } };
      const url = 'https://example.com/movie';

      jest
        .spyOn(movieService, 'shareMovie')
        .mockRejectedValue(new Error('Failed to share movie'));

      await expect(movieController.shareMovie(url, reqMock)).rejects.toThrow(
        'Failed to share movie',
      );
      expect(movieService.shareMovie).toHaveBeenCalledTimes(2);
    });
  });
});
