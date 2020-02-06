const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const {sequelize} = require('./models');
const passport = require('passport');
const passportConfig = require('./passport');
sequelize.sync();
passportConfig(passport);

require('dotenv').config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT||8070);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:false})); 
//form에서 데이터를 보내면 urlencoded가 읽어서 인코딩을 해주고 req.body로 보내줌
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({  
    resave:false, //세션 객체 안에 수정사항이 없을 때 저장여부
    saveUninitialized:false, //처음에 빈 세션 객체 저장 여부
    secret:process.env.COOKIE_SECRET, //cookieParser()의 쿠키 시크릿과 비교할 것이므로 같아야 함
    cookie:{
        httpOnly:true, //자바스크립트의 쿠키 접근 여부
        secure:false, //쿠키의 https 사용 여부
    },
}));
app.use(passport.initialize());
app.use(passport.session());

//라우터 만나기 전에 deserializeUser 먼저 실행됨
app.use('/', indexRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 서버 실행중입니다.`);
});