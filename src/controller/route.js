// 최상위 라우터

// express router
const express = require('express');
const router = express.Router();

//env
const PATH = process.env.SERVER_PATH;

// children routes
const signUp = require('./signUp');
const signIn = require('./signIn');
const {sessionCheckMiddleware, sessionCheck} = require('./sessionCheck');
const post = require('./post');
const test = require('./test/test');
const comment = require('./comment');
const friend = require('./friend');
const file = require('./file');

router.use('/image',express.static(PATH+"/src/view/image"));
router.use('/image/profile',express.static(PATH+"/src/view/image/profile"));
router.use('/signUp', signUp);
router.use('/signIn', signIn);
router.use('/sessionCheck', sessionCheck);

router.use('/test', test);

router.use('/', sessionCheckMiddleware);
router.use('/post', post);
router.use('/comment', comment);
router.use('/friend', friend);
router.use('/file', file);

router.use((req,res,next) => {
    res.status(404);
    res.json({status:"FAILURE"});
});

module.exports = router;