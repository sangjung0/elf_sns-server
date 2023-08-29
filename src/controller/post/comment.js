// express router
const express = require('express');
const router = express.Router();

const PATH = process.env.SERVER_PATH;

// model
const {getCommentByPostId} = require(PATH + '/src/model/post/comment');
const {getUserInfoByUserId} = require(PATH + '/src/model/auth/account');

router.post('/', async (req, res)=>{
    try{
        const postId = req.body.postId;
        const contentId = req.body.contentId;
        const requestValue = req.body.requestValue;

        
        const [commentsArray, state] = await getCommentByPostId(postId, contentId, requestValue);
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

module.exports = router;