
  

# NestJS + React + Socket.IO Demo App

  

This is an Alert System that is built with NestJS, ReactJS using Socket.io and API for communication between client and server.

  

  

## Build & Run with Docker

  

  

To run production build locally or on cloud with docker:

  

  

1. Make sure you have `docker-compose` installed on your machine

  

2. Make sure ports 8080 & 80 are free

  

3. Run: `docker-compose up -d`

  

  

## Run Locally in Development mode

  

  

To run locally for development, first make sure you are using Node.js 18 & Python 3.10, and installed `yarn` on your machine.

  

Then, open Terminal in root dir and do the following:

  

1.  `chmod +x ./install.sh && ./install.sh`

  

This will install dependencies for both client & server apps.

  

Alternativley, you can do:

  

2.  `cd client; yarn install` - To install client's dependencies

  

3.  `cd server; yarn install` - To install server's dependencies

  

Then, run both apps with:

  

4. Client - `cd client` and `yarn start`

  

5. Server - `cd server` and `yarn start:dev`
	6. Make sure you have a Mongo DB server available and change your `.env` file accordingly. (default is localhost:27017)
	7. You can use the MongoDB service from the `docker-compsoe.yml`, by running locally this command `docker-compose up -d mongo_db`. This will run only the MongoDB service on your machine.

  

  

### Happy Alerting 🚀