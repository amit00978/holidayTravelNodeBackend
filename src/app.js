const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const cors = require('cors');
const helmet = require('helmet')
const packageRouter = require('./routes/packageRoutes')
const userRouter = require('./routes/userRoutes')
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController')


const app = express();

// Set Security Http headers
app.use(helmet());

app.use(cors({
    origin: '*',   // Allow any frontend to access
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));
  

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}

const limiter = rateLimit({
    max:100,
    windowMs: 60*60*100,
    message: 'To many requests from this IP'
})

app.use('/api',limiter);

app.use(express.json({
    limit:'10kb'
}));

app.use('/api/v1/packages',packageRouter)
app.use('/api/v1/users',userRouter)

app.all('*', (req, res,next) => {
    next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;