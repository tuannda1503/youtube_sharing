import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entity/movie.entity';
import { Repository } from 'typeorm';
import { ShareMovieDto } from './dto/share-movie.dto';
import axios from 'axios';

jest.mock('axios');

describe('MovieService', () => {
  let service: MovieService;
  let movieRepository: Repository<Movie>;

  const mockMovieRepository = {
    find: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of movies', async () => {
      const result = [new Movie()];
      mockMovieRepository.find.mockResolvedValue(result);

      expect(await service.find()).toBe(result);
      expect(mockMovieRepository.find).toHaveBeenCalled();
    });
  });

  describe('shareMovie', () => {
    it('should share a movie and return true', async () => {
      const shareMovieDto: ShareMovieDto = {
        url: 'https://www.youtube.com/watch?v=example',
        userId: 1,
        email: 'test@example.com',
      };

      const videoInfo = {
        items: [
          {
            snippet: {
              title: 'Test Movie',
              description: 'Test Description',
            },
          },
        ],
      };

      (axios.get as jest.Mock).mockResolvedValue({ data: videoInfo });
      mockMovieRepository.save.mockResolvedValue(new Movie());

      const result = await service.shareMovie(shareMovieDto);
      expect(result).toBe(true);
      expect(mockMovieRepository.save).toHaveBeenCalled();
    });

    it('should return false if video info fetch fails', async () => {
      const shareMovieDto: ShareMovieDto = {
        url: 'https://www.youtube.com/watch?v=example',
        userId: 1,
        email: 'test@example.com',
      };

      (axios.get as jest.Mock).mockRejectedValue(new Error('Fetch error'));

      const result = await service.shareMovie(shareMovieDto);
      expect(result).toBe(false);
    });
  });

  describe('getVideoInfo', () => {
    it('should return video info', async () => {
      const url = 'https://www.youtube.com/watch?v=example';
      const videoId = 'example';
      const videoInfo = { items: [{ snippet: { title: 'Test', description: 'Test' } }] };

      (axios.get as jest.Mock).mockResolvedValue({ data: videoInfo });

      const result = await service.getVideoInfo(url);
      expect(result).toEqual(videoInfo);
      expect(axios.get).toHaveBeenCalledWith(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`);
    });

    it('should throw an error if fetching video info fails', async () => {
      const url = 'https://www.youtube.com/watch?v=example';
      (axios.get as jest.Mock).mockRejectedValue(new Error('Fetch error'));

      await expect(service.getVideoInfo(url)).rejects.toThrow('Failed to fetch video info');
    });
  });

  describe('getYoutubeVideoId', () => {
    it('should return a valid video ID for a valid YouTube URL', () => {
      const url = 'https://www.youtube.com/watch?v=abcdefghijk';
      const videoId = service.getYoutubeVideoId(url);
      expect(videoId).toBe('abcdefghijk');
    });

    it('should return null for an invalid YouTube URL', () => {
      const url = 'https://www.example.com/watch?v=invalid';
      const videoId = service.getYoutubeVideoId(url);
      expect(videoId).toBeNull();
    });

    it('should return null for a malformed YouTube URL', () => {
      const url = 'not_a_youtube_url';
      const videoId = service.getYoutubeVideoId(url);
      expect(videoId).toBeNull();
    });

    it('should return a valid video ID for a shortened YouTube URL', () => {
      const url = 'https://youtu.be/abcdefghijk';
      const videoId = service.getYoutubeVideoId(url);
      expect(videoId).toBe('abcdefghijk');
    });

    it('should return null if the video ID is not 11 characters long', () => {
      const url = 'https://www.youtube.com/watch?v=short';
      const videoId = service.getYoutubeVideoId(url);
      expect(videoId).toBeNull();
    });
  });
});
