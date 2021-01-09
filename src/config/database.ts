require('dotenv').config()

module.exports = {
  "development": {
    "username": "root",
    "password": "mypassword",
    "database": "example",
    "host": "ec2-175-41-175-248.ap-southeast-1.compute.amazonaws.com",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
