// express router
const express = require('express');
const router = express.Router();

const PATH = process.env.SERVER_PATH;

// model
const {totalPostFromUserIdArray, getPostFromUserIdArray, getLargestId} = require(PATH + '/src/model/post/post');
const {getFriendIdFromUserId} = require(PATH + '/src/model/relation/friend');
const {getImgByPostId} = require(PATH + '/src/model/post/image');

router.post('/', async (req, res)=>{
    try{
        const currentPage = req.body.currentPage;
        const loadValue = req.body.loadValue;
        const userId = res.locals.userId;
        const [data,state] = await getFriendIdFromUserId(userId);
        if(state !== "SUCCESS"){
            throw data;
        }
        const friendsArray = data.map((friend) => [friend.dataValues.UserId, friend.dataValues.FriendId]);
        const temp = friendsArray.flatMap(friend => Array.isArray(friend) ? friend : [friend]);
        const friends = Array.from(new Set(temp)).filter(id => userId !== id);
        console.log(friends);
        const [totalPage, totalPageState] = await totalPostFromUserIdArray(friends);
        if(totalPageState !== "SUCCESS"){
            throw totalPage;
        }
        const [largestId, largestIdState] = await getLargestId();
        if(largestIdState !== "SUCCESS"){
            throw largestId;
        }
        const [posts, postsState] = await getPostFromUserIdArray(friends, currentPage === null ? largestId +1 : currentPage, loadValue);
        if(postsState !== "SUCCESS"){
            throw posts;
        }
        const postsFunction = posts.map(async post =>{
            const [imgs, state] = await getImgByPostId(post.id);
            if(state !== "SUCCESS"){
                throw imgs;
            }
            const imgsArray = imgs.map(img=>img.dataValues.url);
            return {
                id:post.id,
                author: {
                    id: post.userId,
                    imgUrl: "../img/test_img/사람_1.jpg" // 임시 설정.
                },
                createAt: new Date(post.createAt).getTime(),
                imgUrl: imgsArray,
                content: post.content,
                comments: [{ //임시 설정
                    commentId:"commentId_123412",
                    userId:"userId_123123",
                    createAt:1698469752808,
                    comment:"와 진짜 개공감 ㅇㅈ"
                },{
                    commentId:"commentId_123412",
                    userId:"userId_123123",
                    createAt:1698469752808,
                    comment:"와 진짜 개공감 ㅇㅈ"
                }],
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