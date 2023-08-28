const {Comment} = require(process.env.SERVER_PATH + "/models");

const register = async (content, postId, userId) => {
    try{
        const post = await Comment.create({
            content,
            postId,
            userId
        });
        return [post.dataValues.id, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }
}

const totalCommentsFromPostId = async (postId) => {
    try{
        const count = await Comment.count({
            where:{
                postId
            }
        });
        return [count, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }

}

const getCommentByPostId = async (postId, currentId, value) => {
    try{
        const option = currentId ? {id: {[Op.lt]: currentId}}: {};
        const comments = await Comment.findAll({
            where:{
                postId,
                ...option
            },
            limit: value
        });
        return [comments, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }
}

module.exports.register = register;
module.exports.getCommentByPostId = getCommentByPostId;
module.exports.totalCommentsFromPostId = totalCommentsFromPostId;