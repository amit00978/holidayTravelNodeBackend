
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


module.exports = (err, req, res, next) => {

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);

    }
    else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    }



}