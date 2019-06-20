# Phonebook REST API

## Running

#### Development Start Up:
```bash
# API
# install packages
npm i
# run local server (with nodemon)
npm run dev
# the server will be available by default at URL `http://0.0.0.0:3010`
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
