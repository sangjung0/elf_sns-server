// express router
const express = require('express');
const router = express.Router();

const PATH = process.env.SERVER_PATH;

// model
const {getCommentByPostId, register, modify, remove} = require(PATH + '/src/model/comment');
const {getUserInfoByUserId} = require(PATH + '/src/model/account');

router.post('/get', async (req, res)=>{
    try{
        const postId = req.body.postId;
        const commentId = req.body.commentId;
        const requestValue = req.body.requestValue;

        
        const [commentsArray, state] = await getCommentByPostId(postId, commentId, requestValue);
        if(state !== "SUCCESS"){
            throw commentsArray;
        }
        const commentsFunction = commentsArray.map( async comment => {
            const [userInfo, userInfoState] = await getUserInfoByUserId(comment.userId);
            if(userInfoState !== "SUCCESS"){
                throw userInfo;
            }
            return {
                commentId: comment.id,
                author:{
                    id: comment.userId,
                    img: userInfo.imageUrl,
                    name: userInfo.name
                },
                createdAt:comment.createdAt.getTime(),
                comment: comment.content
            }
        });
        const comments = await Promise.all(commentsFunction);
        
        res.json({
            state: "SUCCESS",
            payload:comments
        });

    }catch(err){
        console.error(err);
        res.status(500);
        res.json({state:"ERROR"});
    }
});

router.post('/set', async (req, res)=>{
    try{
        const postId = req.body.postId;
        const content = req.body.content;
        const userId = res.locals.userId;

        
        const [result, state] = await register(content, postId, userId);
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

router.post('/modify', async (req, res)=>{
    try{
        const content = req.body.content;
        const commentId = req.body.commentId;

        const [result, state] = await modify(commentId, content);
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

router.post('/remove', async (req, res)=>{
    try{
        const commentId = req.body.commentId;

        const [result, state] = await remove(commentId);
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