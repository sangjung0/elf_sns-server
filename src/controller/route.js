// 최상위 라우터

// express router
const express = require('express');
const router = express.Router();

//env
const PATH = process.env.SERVER_PATH;

// children routes
const signUp = require('./auth/signUp');
const signIn = require('./auth/signIn');
const {sessionCheckMiddleware, sessionCheck} = require('./auth/sessionCheck');
const post = require('./post/post');
const test = require('./test/test');
const comment = require('./post/comment');

router.use('/public',express.static(PATH+"/src/view"));
router.use('/signUp', signUp);
router.use('/signIn', signIn);
router.use('/sessionCheck', sessionCheck);

router.use('/test', test);

router.use('/', sessionCheckMiddleware);
router.use('/getContents', post);
router.use('/getComments', comment);

router.use((req,res,next) => {
    res.status(404);
    res.json({status:"FAILURE"});
});

module.exports = router;