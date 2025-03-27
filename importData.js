const dotenv = require('dotenv');
const fs = require('fs')
const mongoose = require('mongoose');
dotenv.config({path:'./config.env'});
const app = require('./src/app')


const Package = require('./src/models/packageModel');


const DB = process.env.DATABASE_URL.replace('<DB_PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
  .then(() => {

    console.log('Successfully connected to MongoDB');
  })
  .catch(err => {
    console.error('Connection error', err);
  });

  // Read JSON FILE

  const package = JSON.parse(fs.readFileSync(`${__dirname}/tourPackage.json`));

  const importData = async ()=>{

    try {
            await Package.create(package);
            console.log("===data successfully!!!")
    } catch (err) {
            console.log("======err",err)
    }
  }

const deleteAll = async ()=>{

    try {
        await Package.deleteMany();
        console.log("===data deleted successfully!!!")
} catch (error) {
        console.log("======err",err)
}

}
console.log(process.argv)
if(process.argv[2]=='--import'){
    importData();
}else if(process.argv[2]=='--delete'){
    deleteAll();
}


