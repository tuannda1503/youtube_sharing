import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from './entity/movie.entity';
import { ShareMovieDto } from './dto/share-movie.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  async findAll(): Promise<Movie[]> {
    return await this.movieService.find();
  }

  @Post('share')
  @UseGuards(AuthGuard)
  async shareMovie(
    @Body('url') url: string,
    @Req() req: any,
  ): Promise<boolean> {
    const dto: ShareMovieDto = {
      url,
      userId: req.user.sub,
      email: req.user.email,
    };
    const shared = await this.movieService.shareMovie(dto);
    return shared;
  }
}
