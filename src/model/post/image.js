const {Image} = require(process.env.SERVER_PATH + "/models");

const register = async (url, postId) => {
    try{
        const post = await Image.create({
            url,
            postId
        });
        return [post.dataValues.id, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }
}

const getImgByPostId = async (postId) => {
    try{
        const imgs = await Image.findAll({
            where:{
                postId
            }
        });
        return [imgs, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }
}

module.exports.register = register;
module.exports.getImgByPostId = getImgByPostId;