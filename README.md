![Demo GIF](https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif)

# INNO CHATTER API
- An Innovative Chatting Application

## Table of Contents
- [Overview](#overview)
- [Setup and Run Instructions](#setup-and-run-instructions)
- [Technology Choices and Versions](#technology-choices-and-versions)
- [Testing and Coverage Reports](#testing-and-coverage-reports)
- [Docker setup](#docker-and-docker-compose)
- [Additional Information](#additional-information)

## Overview
This project implements a basic user management system with a one-to-one chat feature, 
incorporating real-time communication through WebSocket and Socket.io. 
It covers user registration, login, profile management, and real-time messaging. 
The backend is built using TypeScript, Node.js, Express.js, and WebSocket, with MongoDB used for data storage.
The application is organized following object-oriented programming and reactive programming concepts. 
It includes unit tests, integration tests, API testing, and comprehensive API documentation using Swagger.

## Setup and Run Instructions
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Ameenkp/inno-chatter-api.git
   cd inno-chatter-api
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Clean & Build Project:**
   ```bash
    npm run build
   ```
4. **Start the application:**
   ```bash
    npm run start
   ```
    - make sure that your mongodb server is running or port 27017 
5. **Start the application using nodemon:**
   ```bash
    npm run start-dev-server
   ```
    - make sure that your mongodb server is running or port 27017
6. **Format code:**
   ```bash
    npm run format
   ```
   download api collection from this reference to start testing from postman [postman docs](https://documenter.getpostman.com/view/31106366/2sA2xjyWWF)
7. **to test/demo the socket connection and real time chat feature clone the UI , run and build using below script**
   ```bash
   git clone https://github.com/Ameenkp/inno-chatter-app.git
   npm install --silent
   npm run start
   ```
## Technology Choices and Versions
- **Server-Side:** Node.js (v20.10.0), Express.js (v4.18.2), Typescript (v5.4.2)
- **Authentication:** JWT (JSON Web Tokens)
- **Real-Time Communication:** Socket.io (v4.7.4)
- **Database:** MongoDB (v6.0.1), mongoose (v8.2.1)
- **Testing:** Jest (v29.7.0), SuperTest (v6.3.4)
- **Containerization:** Docker (v25.0.3), Docker Compose (v2.24.5)

## Testing and Coverage Reports
### Unit Testing
- The coverage report will be available in the console since the Jest configuration file is set up with Istanbul code coverage capabilities. 
- Code coverage: ~73%
- Run tests:
  ```bash
  npm test
  ```
## Docker and Docker Compose
This project utilizes Docker for containerization and Docker Compose for orchestrating multi-container applications.

### Docker Build
To build the Docker image, use the following command:
```bash
docker build -t inno-chatter-api:1.0.0 .
```
### Docker Multi platform build
To perform a multi-platform build using Docker Buildx, use the following command
```bash
docker buildx build --platform=linux/amd64 --no-cache -t inno-chatter-api:1.0.0 --load .
```
### Docker Run
To run the docker container, use the following command:
```bash
docker run -d -p 8000:8000 --name inno-chatter-container  inno-chatter-api:1.0.0   
```
### Building and Running the Multi-Container App

1. First, ensure you have Docker and Docker Compose installed and set up on your machine.
   If not, you can follow the guide [here](https://tejaksha-k.medium.com/how-to-install-docker-and-docker-compose-to-ubuntu-20-04-azure-vm-and-aws-ec2-instances-72a498755c15).

2. Once Docker and Docker Compose are set up, you can build and run the multi-container app using the provided `docker-compose-hub.yml` file.
   Run the following command in your terminal:

   #### You can use this command to build images from local and run the container
3. 
      ```bash
      docker-compose up -f docker-compose-local.yml -p inno-chatter-cg-local -d --build
      ```
   #### This docker-compose command pulls the images from docker hub registry , you just need to have docker and docker hub in place 
   #### NB: Please yous this method to see the demo without any hassle

4.
      ```bash
      docker-compose -f docker-compose-hub.yml -p inno-chatter-cg up -d --build
      ```
## API Documentation

This project includes API documentation using Swagger. You can access the Swagger UI to explore and interact with the API endpoints.

### Swagger Endpoint

The Swagger UI is available at the following URL:

[http://localhost:8000/api-docs](http://localhost:8000/api-docs)

Visit this URL in your web browser to view the API documentation and interact with the endpoints.

### API Endpoint Details

The API endpoints are documented using Swagger/OpenAPI specification. You can find details about each endpoint, including methods, parameters, response formats, and examples, in the Swagger UI.

Ensure that the application is running locally on port 8000 before accessing the Swagger UI.

to quickly start testing you can use the published api docs (this is not actual just a simulation / you can use it for trying it out from postman)
[postman docs](https://documenter.getpostman.com/view/31106366/2sA2xjyWWF)


## Additional Information
### Project Structure
- **Project Structure:**
   - `src/controller`: Handles business logic.
   - `src/routes`: Defines API endpoints.
   - `src/models`: Contains data models and interacts with the database.
   - `src/config`: Configuration settings.
   - `src/utils`: Utility functions.
   - `src/middleware`: Custom middleware.
   - `src/errors`: Custom error function.

### Technologies Used:

#### Development Tools:
[<img src="https://www.vectorlogo.zone/logos/gnu_bash/gnu_bash-icon.svg" alt="Bash" width="40" height="40">](https://www.gnu.org/software/bash/)
[<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="Express.js" width="40" height="40">](https://expressjs.com/)
[<img src="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" alt="Git" width="40" height="40">](https://git-scm.com/)

#### Backend and Database:
[<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="Node.js" width="40" height="40">](https://nodejs.org/)
[<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="MongoDB" width="40" height="40">](https://www.mongodb.com/)

#### Operating System and Servers:
[<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg" alt="Linux" width="40" height="40">](https://www.linux.org/)
[<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nginx/nginx-original.svg" alt="Nginx" width="40" height="40">](https://www.nginx.com/)
[<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="Docker" width="40" height="40">](https://www.docker.com/)

#### Backend and Database:
[<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="Node.js" width="40" height="40">](https://nodejs.org/)
[<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="MongoDB" width="40" height="40">](https://www.mongodb.com/)

#### Other Tools and Libraries:
[<img src="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" alt="Postman" width="40" height="40">](https://postman.com/)
[<img src="https://raw.githubusercontent.com/devicons/devicon/d00d0969292a6569d45b06d3f350f463a0107b0d/icons/webpack/webpack-original-wordmark.svg" alt="Webpack" width="40" height="40">](https://webpack.js.org/)
