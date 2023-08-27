const {Post} = require(process.env.SERVER_PATH + "/models");
const {Op} = require('sequelize');

const register = async (userId, content, likeCount) => {
    try{
        const post = await Post.create({
            userId,
            content,
            likeCount
        });
        return [post.dataValues.id, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }
}

const totalPostFromUserIdArray = async (array) => {
    try{
        const count = await Post.count({
            where:{
                userId:{
                    [Op.in]: array
                }
            }
        });
        return [count, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }

}

const getPostFromUserIdArray = async (array, currentId, value) => {
    try{
        const posts = await Post.findAll({
            where:{
                userId:{
                    [Op.in]: array
                },
                id:{
                    [Op.lt]: currentId
                }
            },
            limit: value
        });
        return [posts, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }
}

const getLargestId = async () => {
    try{
        const largestIdPost = await Post.findOne({
            order: [['id', 'DESC']]
        });
        return [largestIdPost.dataValues.id, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }

}
module.exports.register = register;
module.exports.getPostFromUserIdArray = getPostFromUserIdArray;
module.exports.totalPostFromUserIdArray = totalPostFromUserIdArray;
module.exports.getLargestId = getLargestId;