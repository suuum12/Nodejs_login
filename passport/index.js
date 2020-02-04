const local = require('./localStrategy');
const {User} = require('../models');

module.exports = (passport) =>{

//{ id, email, nick } -> user.id
passport.serializeUser((user,done) =>{ //req.login에서 가져온 user
    done(null,user.id);
    //세션 저장소의 부담을 줄이기 위해 user.id만 세션에 저장함
});

// user.id -> { id, email, nick } 
passport.deserializeUser((id,done) =>{// user.id
    User.find({where:{id}}) //user.id로 디비 접근
      .then(user => done(null,user)) 
      //가져온 데이터를 사용할 수 있도록 req.user라는 이름으로 가공
      .catch(err => done(err));
});

local(passport);
}