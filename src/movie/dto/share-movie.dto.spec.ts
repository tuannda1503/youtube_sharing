import { ShareMovieDto } from './share-movie.dto';

describe('ShareMovieDto', () => {
  it('should be defined', () => {
    const dto = new ShareMovieDto();
    expect(dto).toBeDefined();
  });

  it('should have the correct properties', () => {
    const dto = new ShareMovieDto();
    dto.url = 'https://www.youtube.com/watch?v=example';
    dto.userId = 1;
    dto.email = 'test@example.com';

    expect(dto.url).toEqual('https://www.youtube.com/watch?v=example');
    expect(dto.userId).toEqual(1);
    expect(dto.email).toEqual('test@example.com');
  });
}); 