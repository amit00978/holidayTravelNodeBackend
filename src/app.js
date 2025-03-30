const express = require('express');
const morgan = require('morgan');
const packageRouter = require('./routes/packageRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

app.use(express.json());

app.use('/api/v1/packages',packageRouter)
app.use('/api/v1/users',userRouter)
app.all('*', (req, res) => {

    res.status(404).json({
        status: 'fail',
        message:   `Can't find ${req.originalUrl} on this server!`   
    })
});

module.exports = app;