import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
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

  it('/ (GET)', (done) => {
    request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!')
      .end((err, res) => {
        if (err) {
          console.log('err: ', err);
          console.log('statusCode:', res.statusCode);
          console.log('res.text: ', res.text);
          console.log('body:', res.body);
          console.log('headers: ', res.headers);
          return done(err);
        }
        return done();
      });
  });
});
