<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# NestJS GridFS File Upload Service

A NestJS application that provides file upload and management capabilities using MongoDB's GridFS.

## Features

- File upload with GridFS storage
- File download
- File deletion
- List all files
- Swagger API documentation

## Prerequisites

- Node.js
- MongoDB running on port 62553
- npm or yarn

## Installation

```bash
npm install
```

## Configuration

The application connects to:
- MongoDB URL: `mongodb://localhost:27017`
- Database: `fs`

## API Endpoints

### Files

- `POST /files/upload` - Upload a file
- `GET /files` - Get list of all files
- `GET /files/:id` - Download a file by ID
- `DELETE /files/:id` - Delete a file by ID

### API Documentation

Swagger documentation is available at `/api` endpoint when running the application.

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Technologies

- NestJS
- MongoDB/GridFS
- Multer
- Swagger/OpenAPI
