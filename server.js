const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({path:'./config.env'});
const app = require('./src/app')


const DB = process.env.DATABASE_URL.replace('<DB_PASSWORD>',process.env.DATABASE_PASSWORD);


mongoose.connect(DB)
  .then(() => {

    console.log('Successfully connected to MongoDB');
  })
const port = process.env.PORT
const server  = app.listen(port, () => {
    console.log(`=======App running on port ${port}...`)
});


process.on('unhandledRejection', (err, promise) => {
  console.log(err.name,err.message)
  console.error('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    console.log('Server closed. Exiting...');
    process.exit(1);
  });

})