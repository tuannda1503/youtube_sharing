<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# YouTube Sharing System

## Introduction
The system uploads YouTube videos and shares them to all users logged into the system.

## Prerequisites
- [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
- Node version >= 20
- Yarn version: 1.22.22
- Docker

## Database Setup (run first to config database)
- Start the database using Docker:
  ```bash
  docker compose up -d
  ```

## Installation & Configuration
1. Clone the repository:
   ```bash
   git clone https://github.com/tuannda1503/youtube_sharing.git
   ```
2. Navigate into the project directory:
   ```bash
   cd youtube_sharing
   ```
3. Copy `.env.example` to `.env` and set the environment variables:
   ```bash
   cp .env.example .env
   ```
4. Install dependencies:
   ```bash
   yarn install
   ```
5. Run database migrations:
   ```bash
   yarn migrate:run
   ```
6. Start the development server:
   ```bash
   yarn start:dev
   ```
7. Access the application at [localhost:3001](http://localhost:3001) to see "Hello world!".

## Running the Application
- Run migrations:
  ```bash
  yarn migrate:run
  ```
- Start the project:
  ```bash
  yarn start:dev
  ```
  Access the application at [localhost:3001](http://localhost:3001).

## Docker Deployment
(Optional for Backend developers)
- Build the Docker image and run containers:
  ```bash
  docker build -t youtube_sharing .
  docker run -p 3001:3001 youtube_sharing
  ```

## Usage
- The application allows users to upload YouTube videos and share them with all logged-in users. Ensure you are logged in to access the sharing features.

## Troubleshooting
- **Issue**: Cannot connect to the database.
  - **Solution**: Ensure Docker is running and the database container is up. Use `docker ps` to check running containers.

- **Issue**: Application not starting.
  - **Solution**: Check if all dependencies are installed correctly. Run `yarn install` again if necessary.

- **Issue**: Migration errors.
  - **Solution**: Ensure the database is running and accessible. Check the database connection settings in your environment configuration.

For further assistance, please refer to the project's documentation or contact the maintainers.

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).