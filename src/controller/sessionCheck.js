// express router
const express = require('express');
const router = express.Router();

//env
const PATH = process.env.SERVER_PATH;

// model
const {verify} = require(PATH + '/src/model/session');
const {getUserInfoByUserId} = require(PATH + '/src/model/account');

const sessionCheck = async(req) => {
    const sessionId = req.cookies.SESSION;
    const [data, state] = await verify(sessionId);
    switch(state) {
        case "SUCCESS":
            const [userInfo, state] = await getUserInfoByUserId(data.userId);
            if ( state !== "SUCCESS" ) {
                throw userInfo;
            }
            return {state:"SUCCESS", payload: {id: data.userId, img: userInfo.imageUrl}};
        case "FAILURE":
            return {state:"FAILURE", data};
        default:
            throw data;
    }
}

const sessionCheckMiddleware = async(req, res, next) => {
    try{
        res.locals.userId = (await sessionCheck(req)).payload.id;
        next();
    }catch(err){
        console.error(err);
        res.status(500);
        res.json({state:"ERROR"});
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