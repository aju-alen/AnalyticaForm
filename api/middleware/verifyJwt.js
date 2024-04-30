import jwt from 'jsonwebtoken';

export const verifyJwt = (req, res, next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log(decoded, 'decoded');
        if(decoded.email === undefined || decoded.id === undefined || decoded.firstName === undefined || decoded.isAdmin === undefined) {
            return res.status(403).json({ message: 'Invalid tokennn' });
        }
        req.tokenEmail = decoded.email;
        req.tokenId = decoded.id;
        req.tokenFirstName = decoded.firstName;
        req.tokenAdmin = decoded.isAdmin;
        next();
    });
};