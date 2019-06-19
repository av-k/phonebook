# Phonebook Example Application

### Technology stack:
* [NodeJS](https://nodejs.org/)
* [Hapi.js](https://hapijs.com/)
* [Swagger](https://swagger.io/)
* [MongoDB](https://www.mongodb.com/)
* [React](https://reactjs.org/) 
* [Docker](https://www.docker.com/)

## Running

#### Clone
```bash
git clone https://github.com/av-k/phonebook.git
```

#### Production Start Up:
```bash
docker-compose up
# REST API will be available at URL `http://0.0.0.0:3010`
# Web client will be available at URL `http://0.0.0.0:3000`
```

#### Development:
For a start in `docker-compose.yml` comment out the code for services `api` + `web` and start `db` service for DB instance.

```bash
# API
# install packages
cd api
npm i
# run local server (with nodemon)
npm run dev
# the server will be available by default at URL `http://0.0.0.0:3010`

# WEB
# install packages
cd web
npm i
# run local server
npm run dev
# the server will be available by default at URL `http://0.0.0.0:3000`
```

### Demo files
* The list of 30 contacts [contacts.csv](https://github.com/av-k/phonebook/blob/master/demo/contacts.csv)  

## Documentation

#### REST API
* **Swagger** will be available by default at URL `http://0.0.0.0:3010/v1/documentation` 
