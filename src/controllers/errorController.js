
const AppError = require('../utils/AppError');
const sendErrorDev =(err,res)=>{
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message || 'Something went wrong!',
        stack: err.stack,
        error: err
    });
}

const sendErrorProd =(err,res)=>{
    if(err.isOperational){
        res.status(err.statusCode || 500).json({
            status: err.status || 'error',
            message: err.message || 'Something went wrong!',
        });
    }else{
        // log the error
        console.error('Error!!!', err.message);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }

}

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(400,message);
}

const  handleDuplicateFieldsDB  = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]; // Extract the value from the error message.
    const message = `Duplicate field value: ${value}. Please use unique value.`;
    return new AppError(400, message);
}

const handleValidationErrorDB = (err, res) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(400, message);
}

module.exports = (err, req, res, next) => {

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);

    }
    else if (process.env.NODE_ENV === 'production') {
        let error = {...err};
        if(err.name === 'CastError'){
          error =  handleCastErrorDB(err, res);
        }
        else if(error.code === 11000){
            error = handleDuplicateFieldsDB(err, res);
        }
        else if(err.name === 'ValidationError'){
            error = handleValidationErrorDB(err, res);
        }

        sendErrorProd(error, res);
    }




}