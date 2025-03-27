const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({path:'./config.env'});
const app = require('./src/app')


const DB = process.env.DATABASE_URL.replace('<DB_PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
  .then(() => {

    console.log('Successfully connected to MongoDB');
  })
  .catch(err => {
    console.error('Connection error', err);
  });


const port = process.env.PORT
app.listen(port, () => {
    console.log(`=======App running on port ${port}...`)
});
