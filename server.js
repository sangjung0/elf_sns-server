const express = require('express');
const app = express();
const session = require('express-session');
const {sequelize} = require('./models');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//env
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const EXPIRES = Number(process.env.EXPIRES);

// router
const router = require('./src/controller/route');

//db 
sequelize.sync({force:false})
  .then(()=>{
    console.log('데이터베이스 연결 성공');
  })
  .catch((err)=>{
    console.error(err);
  });

app.set('port', process.env.PORT || 8080);

app.use(cors({
  origin: ['*', "http://localhost:3000"],
  methods: "POST",
  credentials: true
}));

app.use(session({
  secret: SECRET_KEY, 
  resave: false, 
  saveUninitialized: true,
  cookie: {
      expires: EXPIRES // 30분 * 60초 * 1000밀리초
  }
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use('/', router);

app.listen(app.get('port'), () => {
  console.log("Listening at",app.get('port'));
});