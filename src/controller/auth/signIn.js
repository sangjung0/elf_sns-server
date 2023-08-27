// express router
const express = require('express');
const router = express.Router();

//env
const PATH = process.env.SERVER_PATH;
const EXPIRES = Number(process.env.EXPIRES);

// model
const {verify} = require(PATH + '/src/model/auth/account');
const {register} = require(PATH + '/src/model/auth/session');

router.post('/', async (req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const sessionId = req.sessionID;
        
        const [data, status] = await verify(email, password);
        switch(status) {
            case "SUCCESS":
                const [sessionData, sessionStatus] = await register(sessionId, EXPIRES, data)
                switch(sessionStatus){
                    case "SUCCESS":
                        res.json({state:"SUCCESS", payload:{sessionId, expires:EXPIRES, path:"/"}});
                        break;
                    default:
                        throw sessionData;
                }
                break;
            case "FAILURE":
                res.json({state:"FAILURE", data});
                break;
            default:
                throw data;
        }
    }catch(err){
        console.error(err);
        res.status(500);
        res.json({state:"ERROR"});
    }
});

module.exports = router;