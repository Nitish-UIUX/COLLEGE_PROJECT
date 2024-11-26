import jwt from 'jsonwebtoken';
import fs from 'fs';
import blacklist  from '../APIs/ApiFunctions/UsersFunction.js';


// Load private and public keys
const publicKey = fs.readFileSync('./keys/public.key', 'utf8');







export const verifyToken = (req, res, next) => {
    const token1 = req.headers.authorization?.split(' ')[1];
    if (!token1) {
        // console.log("Authorization header missing");
        return res.status(401).json({ message: 'Unauthorized: Authorization header missing' });
    }

    // Remove the "" from the token if present
    const token = token1.replace(/^"(.*)"$/, '$1');
    // console.log(token);

    if (!token) {
        console.log("Token not provided");
        return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }
    // console.log('blacklist:', blacklist);
    // Check if the token is blacklisted
    if (blacklist.has(token)) {
        console.log("Token is blacklisted");
        return res.status(401).json({ message: 'Unauthorized: Token has expired' });
    }

    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            console.log("Invalid token:", err);
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        req.authData = decoded;
        next();
    });
};


















/////////////////////////////----------------------------------------------------------------------------------------------------------------------
// export const verifyToken = (req, res, next) => {
//     const token1 = req.headers.authorization?.split(' ')[1];
//     //remove the "" from the token
//     const token = token1.replace(/^"(.*)"$/, '$1');

//     // console.log(token1);
//     // console.log('-------------------');
//     // console.log(token);

//     if (!token) {
//         console.log("Token not provided");
//         return res.status(401).json({ message: 'Unauthorized: Token not provided' });
//     }

  
//     // if (blacklist.has(token)) {
//     //     console.log("Token is blacklisted");
//     //     return res.status(401).json({ message: 'Unauthorized: Token is blacklisted' });
//     // }
    

//     jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
//         if (err) {
//             console.log(err);
//             return res.status(403).json({ message: 'Forbidden: Invalid token' });
//         }
//         req.authData = decoded;
//         next();
//     });

// }


// verifyToken and also check if the user is an admin or not using role 
export const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }

    if (blacklist.has(token)) {
        return res.status(401).json({ message: 'Unauthorized: Token is blacklisted' });
    }


    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        if (decoded.user.role !== 1) {
            return res.status(403).json({ message: 'Forbidden: User is not an admin' });
        }
        req.authData = decoded;
        next();
    });

}





