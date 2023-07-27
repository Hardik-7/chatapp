module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = (process.env.NODE_ENV === 'production') ? 'Something went wrong !' : err.message 
    res.status(statusCode).json({
        success:false,
        message
    })
}