module.exports = {

  // MongoDB connection options
  // 'mongodb://baloo:scikrdev0503@ds061839.mongolab.com:61839/scikr-dev'
  mongo: {
    uri: 'mongodb://localhost/scrapper',
    options: {
      db: {
        safe : true
      }
    }
  }
};