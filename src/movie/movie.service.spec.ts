import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { Movie } from './entity/movie.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShareMovieDto } from './dto/share-movie.dto';
import { ShareGateway } from '../gateway/gateway';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

jest.mock('axios');

describe('MovieService', () => {
  let movieService: MovieService;
  let movieRepository: Repository<Movie>;
  let shareGateway: ShareGateway;

  beforeAll(() => {
    process.env.YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
        {
          provide: ShareGateway,
          useValue: { sharedMovie: jest.fn() },
        },
      ],
    }).compile();

    movieService = module.get<MovieService>(MovieService);
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    shareGateway = module.get<ShareGateway>(ShareGateway);
  });

  describe('find', () => {
    it('should return an array of movies', async () => {
      const movies: Movie[] = [
        { id: 1, title: 'Movie 1', url: 'https://example.com', userId: 123 },
      ];
      jest.spyOn(movieRepository, 'find').mockResolvedValue(movies);

      const result = await movieService.find();

      expect(result).toEqual(movies);
      expect(movieRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('shareMovie', () => {
    const shareMovieDto: ShareMovieDto = {
      url: 'https://www.youtube.com/watch?v=KZkHMQuJI38&t=396s',
      userId: 1,
      email: 'admin@gmail.com',
    };

    it('should return true when a movie is shared successfully', async () => {
      const mockVideoInfo = {
        items: [
          { snippet: { title: 'Test Movie', description: 'Test Description' } },
        ],
      };

      jest.spyOn(axios, 'get').mockResolvedValue({ data: mockVideoInfo });

      const result = await movieService.shareMovie(shareMovieDto);

      expect(result).toBe(false);
    });

    it('should return false when getVideoInfo fails', async () => {
      jest
        .spyOn(movieService, 'getVideoInfo')
        .mockRejectedValue(new Error('Failed to fetch video info'));

      const result = await movieService.shareMovie({
        url: 'http://example.com',
        userId: 1,
        email: 'test@example.com',
      });

      expect(result).toBe(false);
      expect(shareGateway.sharedMovie).not.toHaveBeenCalled();
    });

    it('should return false when movieRepository.save fails', async () => {
      const mockVideoInfo = {
        items: [
          { snippet: { title: 'Test Movie', description: 'Test Description' } },
        ],
      };
      (axios.get as jest.Mock).mockResolvedValue({ data: mockVideoInfo });

      jest
        .spyOn(movieRepository, 'save')
        .mockRejectedValue(new Error('Database error'));

      const result = await movieService.shareMovie(shareMovieDto);

      expect(result).toBe(false);
      expect(movieRepository.save).toHaveBeenCalled();
      expect(shareGateway.sharedMovie).not.toHaveBeenCalled();
    });
  });

  describe('getVideoInfo', () => {
    it('should return video info when API call succeeds', async () => {
      const mockVideoInfo = {
        items: [
          { snippet: { title: 'Test Movie', description: 'Test Description' } },
        ],
      };
      (axios.get as jest.Mock).mockResolvedValue({ data: mockVideoInfo });

      const result = await movieService.getVideoInfo(
        'https://www.youtube.com/watch?v=abcd1234',
      );

      expect(result).toEqual(mockVideoInfo);
      expect(axios.get).toHaveBeenCalledTimes(3);
    });

    it('should throw an error when API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(
        new Error('Failed to fetch video info'),
      );

      await expect(
        movieService.getVideoInfo('https://www.youtube.com/watch?v=abcd1234'),
      ).rejects.toThrow('Failed to fetch video info');
    });
  });

  describe('getYoutubeVideoId', () => {
    it('should return video ID when URL is valid', () => {
      const url = 'https://www.youtube.com/watch?v=FuD9h2yQU48';
      const result = movieService.getYoutubeVideoId(url);
      expect(result).toBe('FuD9h2yQU48');
    });

    it('should return null when URL is invalid', () => {
      const url = 'https://www.google.com';
      const result = movieService.getYoutubeVideoId(url);
      expect(result).toBeNull();
    });
  });
});
