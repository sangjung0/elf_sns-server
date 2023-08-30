// express router
const express = require('express');
const router = express.Router();

const PATH = process.env.SERVER_PATH;

// model
const { getFriendFromUserId, getTotalFriendFromUserId, remove, verify, register } = require(PATH + '/src/model/friend');
const {getUserInfoByUserId, searchUser} = require(PATH + '/src/model/account');

router.post('/get', async (req, res)=>{
    try{
        const userId = res.locals.userId;
        const currentName = req.body.currentName;
        const requestValue = req.body.requestValue;
        const friendName = req.body.friendName;

        
        const [friendArray, state] = friendName === "" ? await getFriendFromUserId(userId, requestValue): await searchUser(friendName, currentName, requestValue);
        if(state !== "SUCCESS"){
            throw friendArray;
        }

        const [totalPage, totalPageState] = await getTotalFriendFromUserId(userId);
        if(totalPageState !== "SUCCESS"){
            throw totalPage;
        }

        const friendFunction = friendArray.map( async f=>{
            //이상한 코드 탄생~ let을 안쓰겠다는 마음가짐~
            const friend = friendName === "" ? 
                f.dataValues.UserId === userId ? f.dataValues.FriendId : f.dataValues.UserId
                :f.dataValues.id;
            const [[userInfo, state], [isFriend, isFriendState]] = friendName === "" ? 
                [
                    await getUserInfoByUserId(friend),
                    [true, "SUCCESS"]
                ] : [
                    [f.dataValues ,"SUCCESS"],
                    await verify(friend, userId)
                ];
            if(isFriendState !== "SUCCESS"){
                throw isFriend;
            }
            if(state !== "SUCCESS"){
                throw userInfo;
            }

            return {
                id: friend,
                img: userInfo.imageUrl,
                name: userInfo.name,
                isFriend
            }
        })

        const friendsTemp = await Promise.all(friendFunction);
        const friends = friendName === "" ? friendsTemp.sort((a,b) => a.name.localeCompare(b.name)):friendsTemp;

        res.json({
            state: "SUCCESS",
            payload:{
                totalPage,
                data: friends
            }
        });

    }catch(err){
        console.error(err);
        res.status(500);
        res.json({state:"ERROR"});
    }
});

router.post('/remove', async (req, res)=>{
    try{
        const id = req.body.id;
        const userId = res.locals.userId;

        const [result, state] = await remove(id, userId);
        if(state !== "SUCCESS"){
            throw result;
        }
        res.json({
            state: "SUCCESS"
        });

    }catch(err){
        console.error(err);
        res.status(500);
        res.json({state:"ERROR"});
    }
});

router.post('/add', async (req, res)=>{
    try{
        const id = req.body.id;
        const userId = res.locals.userId;

        const [result, state] = await register(userId, id);
        if(state !== "SUCCESS"){
            throw result;
        }
        res.json({
            state: "SUCCESS"
        });

    }catch(err){
        console.error(err);
        res.status(500);
        res.json({state:"ERROR"});
    }
});

module.exports = router;