# My Phonebook

This repo contains the source code of **Phonebook** web application. Here there is a list of features what also can be used in further projects. 

![ScreenShot](https://user-images.githubusercontent.com/14048639/59875571-46fada80-93cb-11e9-99e4-3daa006a4ddd.png)

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
export $(cat .env.production | xargs) && docker-compose up
# REST API will be available at URL `http://0.0.0.0:3010`
# Web client will be available at URL `http://0.0.0.0:3000`
```

#### Development Start Up:
```bash
export $(cat .env.development | xargs) && docker-compose -f ./docker-compose.development.yml up
# REST API will be available at URL `http://0.0.0.0:3010`
# Web client will be available at URL `http://0.0.0.0:3000`
```

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

### Migrations
```bash
# API
cd API
# the installed dependencies is required (npm i) 
# set up data
npm run migrate up
# set to zero
npm run migrate down
```

### Demo files
* The list of 30 contacts [contacts.csv](https://github.com/av-k/phonebook/blob/master/demo/contacts.csv)

## Documentation

#### REST API
* **Swagger** will be available by default at URL `http://0.0.0.0:3010/v1/documentation` 
