import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MovieController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/movie/share (POST) - should share a movie', async () => {
    // First, login to get the access token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@gmail.com',
        password: '123456',
      })
      .expect(201);

    const accessToken = loginResponse.body.access_token;

    // Now, share a movie
    const shareResponse = await request(app.getHttpServer())
      .post('/movie/share')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ url: 'https://www.youtube.com/watch?v=U6LNR8dLZo0' })
      .expect(201);

    expect(shareResponse.body).toEqual({});
  });
});
