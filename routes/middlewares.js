exports.isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){ //passport가 추가해준 메서드, 로그인 여부 확인하는 메서드
        next();
    }else{
        res.status(403).send('로그인 필요');
    }
}

exports.isNotLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){ //passport가 추가해준 메서드, 로그인 여부 확인하는 메서드
        next();
    }else{
        res.redirect('/');
    }
}