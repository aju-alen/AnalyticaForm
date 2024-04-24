import jwt from 'jsonwebtoken';

export const verifyJwt = (req, res, next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log(authHeader);

    if(!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Unauth'});
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) {
            return res.status(403).json({message: 'Invalid token'});
        }
        req.tokenEmail = decoded.email;
        req.tokenId = decoded.id;
        req.tokenFirstName = decoded.firstName;
        req.tokenAdmin = decoded.isAdmin;
        next();
    });
};