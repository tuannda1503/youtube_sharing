import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/auth/sign-up (POST)', async () => {
    const signUpDto = {
      email: 'test@example.com',
      password: 'testpassword',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send(signUpDto)
      .expect(201);

    expect(response.statusCode).toEqual(201);
  })
});
