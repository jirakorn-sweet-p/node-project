

const redirectIfAuth = async (req, res, next) => {
    if(req.session.userId){
        if(req.session.userType == 'student'){
            return res.redirect('/request');
        }else if(req.session.userType == 'teacher' || req.session.userType == 'admin'){
            return res.redirect('/request-teacher');
        }else{
            return res.redirect('/request');
        }
        
    }
    next();
}
module.exports = redirectIfAuth;