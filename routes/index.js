const express = require('express');
const {User} = require('../models');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

router.get('/',(req,res,next)=>{
    if(req.isAuthenticated()){
        res.render('index',{
            text:req.user.nick,
            isLoggedin:req.isAuthenticated(),
        });
    }else{
        res.render('index',{
            text:'로그인 필요',
            isLoggedin:req.isAuthenticated(),
        });
    }
});

router.post('/change', async (req, res, next) => {
    try { 
    await User.update({ nick: req.body.changenick }, {
      where: { id: req.user.id },
       });
       res.redirect('/');
   }catch(e){
       console.error(e);
       next(e);
   }
});

module.exports=router;