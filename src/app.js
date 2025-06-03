const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const cors = require('cors');
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
const hpp = require('hpp');
const packageRouter = require('./routes/packageRoutes')
const userRouter = require('./routes/userRoutes')
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController')
const inquiryRoutes = require('./routes/inquiryRoutes')


const app = express();

// Set Security Http headers
app.use(helmet());

const allowedOrigins = ['https://www.holidayntravel.com', 'https://holidayntravel.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
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


// Data sanitization againt NoSql query injection

app.use(mongoSanitize());
app.use(xss())
// Prevent parameter polution
app.use(hpp())

app.use('/api/v1/packages',packageRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/inquiry',inquiryRoutes)

app.all('*', (req, res,next) => {
    next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use(globalErrorHandler);

module.exports = app;