const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../models');
const bcrypt = require('bcryptjs');

module.exports = (passport) =>{
    passport.use(new LocalStrategy({
        //이메일이 존재하는지 확인, 비밀번호가 일치하는지 확인 후 둘 다 맞으면 통과시켜주는 역할
        usernameField: 'email', //form의 name 부분
        passwordField: 'password',
    }, async (email, password, done)=>{
      try {
        const exUser = await User.find({where:{email}});
        //에러 시 findOne() 쓰기
        if(exUser) {
          const result = await bcrypt.compare(password, exUser.password);
         //비크립트로 암호화한 첫 인자와 둘 인자를 비교하는 메서드, 결과는 true/false
            if(result){
              done(null, exUser);
            }else{
              done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
            }
        }else{
          done(null, false, {message:'가입되지 않은 회원입니다.'});
        }
      } catch(error) {
          console.error(error);
          done(error);
      }
    }
    ))
};