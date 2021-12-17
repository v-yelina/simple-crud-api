# simple-crud-api

This is a simple CRUD API using only pure Node.js and in-memory database.

## Installation

### Clone repository
`git clone git@github.com:v-yelina/simple-crud-api.git`

### Install dependencies
`npm install` or `npm i`
or `yarn install`

### Run in develpment
`npm run start:dev` or
`yarn run start:dev`

### Run in production
`npm run start:prod` or
`yarn run start:prod`

## Usage
Rotes you can use:
* **GET** `/person` or `/person/${personId}` should return all persons or person with corresponding `personId`
* **POST** `/person` is used to create record about new person and store it in database
* **PUT** `/person/${personId}` is used to update record about existing person
* **DELETE** `/person/${personId}` is used to delete record about existing person from database