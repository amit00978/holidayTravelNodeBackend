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

app.all('*', (req, res,next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.statusCode = 404;
    next(err);
});

app.use((err, req, res, next) => {

    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Something went wrong!'   
     });

    
});

module.exports = app;