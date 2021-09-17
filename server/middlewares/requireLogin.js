module.exports = (req, res, next) => {
    if (!req.user){
        return res.status(401).send({ error: 'You must login first!'});
    }
    //if user exists, let the use continue on
    next();
};