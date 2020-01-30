const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {User} = require('../models');

router.get('/', (req,res,next)=>{
    res.render('auth');
});

//post는 서버의 값이나 상태를 바꾸기 위해 쓰는 메서드
//get은 서버에서 어떤 값을 가져오기 위해 쓰는 메서드
//post는 req.body에 값을 넣어서 서버에 전달하고
//get은 주소 표시줄에 넣어서 서버에 전달한다

//회원가입 페이지
router.post('/join', async (req, res, next) => {
    const {email, nick, password} = req.body;
    try {
        const exUser = await User.findOne({where:{email}});
        if(exUser) {
            return res.redirect('/auth');
        } else {
            const hash = await bcrypt.hash(password, 12);
            //bcrypt.hash() 암호화를 해주는 메서드, await 필수
            console.timeEnd('1');
            await User.create({
                email,
                nick,
                password:hash
            });
            res.redirect('/');
        }
    } catch(error) {
        console.error(error);
        next(error);
    }
});

//로그인 페이지
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (authError,user,info) => {
       if(authError){ //서버 에러
            console.error(authError);
            return next(authError);
        }
       if(!user){ //사용자 정보가 없는 경우
          //req.flash('loginError',info.message);
            return res.redirect('/auth');
        }
        return req.login(user, (loginError) => {
          //유저 정보를 세션에 저장하는 메서드(passport에서 추가해준 메서드)
           if(loginError){
              console.error(loginError);
              return next(LoginError);
            }
            return res.redirect('/');
            //성공했을 경우 메인으로 보내줌
        });
    })
    (req, res, next);
});

//로그아웃 페이지
router.get('/logout', (req, res) => {
   req.logout(); //passport에서 추가해준 메서드
   req.session.destroy(); //req.user를 삭제해줌
   req.redirect('/'); //로그아웃 후 메인으로
});

module.exports = router;