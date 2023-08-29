// express router
const express = require('express');
const router = express.Router();

const PATH = process.env.SERVER_PATH;

// model
const {totalPostFromUserIdArray, getPostFromUserIdArray} = require(PATH + '/src/model/post');
const {getFriendFromUserId} = require(PATH + '/src/model/friend');
const {getImgByPostId} = require(PATH + '/src/model/image');
const {getCommentByPostId} = require(PATH + '/src/model/comment');
const {getUserInfoByUserId} = require(PATH + '/src/model/account');

router.post('/', async (req, res)=>{
    try{
        const contentId = req.body.contentId;
        const requestValue = req.body.requestValue;
        const userId = res.locals.userId;
        const [data,state] = await getFriendFromUserId(userId);
        if(state !== "SUCCESS"){
            throw data;
        }
        const friendsArray = data.map((friend) => [friend.dataValues.UserId, friend.dataValues.FriendId]);
        const temp = friendsArray.flatMap(friend => Array.isArray(friend) ? friend : [friend]);
        const friends = Array.from(new Set(temp)).filter(id => userId !== id);
        const [totalPage, totalPageState] = await totalPostFromUserIdArray(friends);
        if(totalPageState !== "SUCCESS"){
            throw totalPage;
        }
        const [posts, postsState] = await getPostFromUserIdArray(friends, contentId, requestValue);
        if(postsState !== "SUCCESS"){
            throw posts;
        }
        const postsFunction = posts.map(async post =>{
            const [imgs, state] = await getImgByPostId(post.id);
            if(state !== "SUCCESS"){
                throw imgs;
            }
            const [comments, commentsState] = await getCommentByPostId(post.id, null, 10);
            if(commentsState !== "SUCCESS"){
                throw commentsState;
            }
            const commentsFunction = comments.map( async comment => {
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
            const commentsArray = await Promise.all(commentsFunction);
            const imgsArray = imgs.map(img=>img.dataValues.url);
            const [userInfo, userInfoState] = await getUserInfoByUserId(post.userId);
            if(userInfoState !== "SUCCESS"){
                throw userInfo;
            }
            return {
                id:post.id,
                author: {
                    id: post.userId,
                    img: userInfo.imageUrl,
                    name: userInfo.name
                },
                createdAt: post.createdAt.getTime(),
                imgUrl: imgsArray,
                content: post.content,
                comments: commentsArray,
                tags: ["사람","css","뒤져","망할","리액트","버튜얼라이즈","사라져"] //임시 설정
            }
        });

        const postsArray = await Promise.all(postsFunction);
        res.json({
            state: "SUCCESS",
            payload:{
                totalPage: totalPage,
                data: postsArray
            }
        });

    }catch(err){
        console.error(err);
        res.status(500);
        res.json({state:"ERROR"});
    }
});

module.exports = router;