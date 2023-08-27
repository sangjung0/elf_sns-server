// express router
const express = require('express');
const router = express.Router();

const PATH = process.env.SERVER_PATH;

// model
const {makeFakeUserInfo, makeFakeFriend, makeFakePost} = require(PATH + '/src/model/faker/faker');
const {register, userList} = require(PATH + '/src/model/auth/account');
const friend = require(PATH + '/src/model/relation/friend');
const postLib = require(PATH + '/src/model/post/post');
const image = require(PATH + '/src/model/post/image');

router.post('/makeUserInfo', async (req, res)=>{
    try{
        const length = req.body.length;
        const seed = req.body.seed;

        const userInfo = await makeFakeUserInfo(seed,length);
        userInfo.forEach((user)=>{
            register(user.email, user.password, user.name, user.phoneNumber, user.imageUrl);
        });
        res.send(userInfo);

    }catch(err){
        console.error(err);
        res.status(500);
        res.json({state:"ERROR"});
    }
});

router.post('/makeFriends', async (req, res)=>{
    try{
        const seed = req.body.seed;
        const [users, usersState] = await userList();
        if (usersState !== "SUCCESS") {
            throw users;
        }
        
        const userInfo = await makeFakeFriend(seed, users.map((user)=>user.id));
        userInfo.forEach((user)=>{
            user[1].forEach((relation)=>{
                friend.register(user[0], relation);
            });
        });
        res.send(userInfo);

    }catch(err){
        console.error(err);
        res.status(500);
        res.json({state:"ERROR"});
    }
});

router.post('/makePosts', async (req, res)=>{
    try{
        const seed = req.body.seed;
        const length = req.body.length;
        const [users, usersState] = await userList();
        if (usersState !== "SUCCESS") {
            throw users;
        }
        
        const posts = await makeFakePost(seed, length, users.map((user)=>user.id));
        posts.forEach(async (post)=>{
            const [data, state] = await postLib.register(post.userId,post.content,post.likeCount);
            if(state !== "SUCCESS"){
                throw data;
            }
            post.imgUrl.forEach(async (img)=>{
                await image.register(img, data);
            });
        });
        res.send(posts);

    }catch(err){
        console.error(err);
        res.status(500);
        res.json({state:"ERROR"});
    }
});
module.exports = router;