const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv.config({path:'./config.env'});
const app = require('./src/app')


app.use(cors());
process.on('unhandledRejection', (err, promise) => {
  console.log(err.name,err.message);
  console.error('UNHANDLED REJECTION! Shutting down...');
  process.exit(1);


})

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name,err.message);
    process.exit(1);
})

const DB = process.env.DATABASE_URL.replace('<DB_PASSWORD>',process.env.DATABASE_PASSWORD);


mongoose.connect(DB)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
const port = process.env.PORT
const server  = app.listen(port, () => {
    console.log(`=======App running on port ${port}...`)
});


