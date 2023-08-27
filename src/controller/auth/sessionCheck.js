// express router
const express = require('express');
const router = express.Router();

//env
const PATH = process.env.SERVER_PATH;

// model
const {verify} = require(PATH + '/src/model/auth/session');

const sessionCheck = async(req) => {
    const sessionId = req.cookies.SESSION;
    const [data, status] = await verify(sessionId);
    switch(status) {
        case "SUCCESS":
            return {state:"SUCCESS", payload: {userId: data.userId}};
        case "FAILURE":
            return {state:"FAILURE", data};
        default:
            throw data;
    }
}

const sessionCheckMiddleware = async(req, res, next) => {
    try{
        res.locals.userId = (await sessionCheck(req)).payload.userId;
        next();
    }catch(err){
        console.error(err);
        next();
    }
}

router.post('/', async (req, res)=>{
    try{
        res.json(await sessionCheck(req));
    }catch(err){
        console.error(err);
        res.status(500);
        res.json({state:"ERROR"});
    }
});

module.exports.sessionCheckMiddleware = sessionCheckMiddleware;
module.exports.sessionCheck = router;