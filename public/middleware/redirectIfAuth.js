
const redirectIfAuth = (req, res, next) => {
    if(req.session.userId){
        return res.redirect('/request');
    }
    next();
}
module.exports = redirectIfAuth;