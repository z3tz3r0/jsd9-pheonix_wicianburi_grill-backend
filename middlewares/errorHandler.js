const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (!res.headersSent) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server Error",
        });
    }
    next(err);
};

export default errorHandler;
