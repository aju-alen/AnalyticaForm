import ratelimit from 'express-rate-limit';

export const loginLimiter = ratelimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 4, // limit each IP to 100 requests per windowMs
    message: {message:'Too many requests from this IP, please try again after 15 minutes'},
    //sends a 429 status code
    handler: (req, res) => {
        res.status(429).json({message:'Too many requests from this IP, please try again after 1 minutes'});
    },
    standardHeaders: true, // return header with limit and remaining
    legacyHeaders: false, // do not return X-RateLimit headers
});