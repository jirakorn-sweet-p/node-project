
const redirectIfAuth2 = (req, res, next) => {
    if(req.session.userId){
        return res.redirect('/request-teacher');
    }
    next();
}
module.exports = redirectIfAuth2;