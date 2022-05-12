const {
    verifyToken,
}= require('../utility/jwt');

const verifyUser = (req, res, next) => {
    try {
        let { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'You are not authorized to access this resource',
                code: 401
            });
        }
        let verifiedToken = verifyToken(authorization);
        if (!verifiedToken) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'You are not authorized to access this resource',
                code: 401
            });
        }
        req.user= {
            uid: verifiedToken.id,
        }
        next();
    } catch (error) {
        return res.status(500).json({
            error: 'Error while verifying user',
            message: null,
            code: 500
        })
    }
}

module.exports = {
    verifyUser
}