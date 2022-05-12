const jwt= require('jsonwebtoken');
const SIGNING_KEY= process.env.SIGNING_KEY;

module.exports= {
    verifyToken: (token)=> {
        let isValid= jwt.verify(token, SIGNING_KEY);
        return isValid;
    },
    signToken: (payload)=> {
        let token= jwt.sign(payload, SIGNING_KEY);
        return token;
    }
}