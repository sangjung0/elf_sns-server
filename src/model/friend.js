const {Friend} = require(process.env.SERVER_PATH + "/models");
const {User} = require(process.env.SERVER_PATH + "/models");
const {literal} = require('sequelize');
const {Op} = require('sequelize');

const register = async (userId, friendId) => {
    try{
        const [data,state] = await verify(userId, friendId);
        if(state !== "SUCCESS"){
            throw data;
        }
        if(!data){
            await Friend.create({
                userId,
                friendId
            });
        }
        return [null, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }
}

const remove = async (userId, friendId) => {
    try{
        await Friend.destroy({
            where: {
                userId, 
                friendId 
            },
        });
        return [null, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }
}

const verify = async (userId, friendId) => {
    try{
        const user = await Friend.findOne({
            where: {
                userId, 
                friendId 
            },
        });

        if (user){
            return [true, "SUCCESS"];
        }else{
            return [false, "SUCCESS"];
        }
    }catch(error){
        return [error, "ERROR"];
    }
}

const getFriendFromUserId = async(userId, currentName=null, requestValue=null) => {
    try{
        const option = currentName ? {[Op.and]: literal(`FriendId.name > '${currentName}'`) }: {};
        const limit = requestValue ? {limit: requestValue} : {};
        const friends = await Friend.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                    as: 'FriendId',
                    required: true
                }
            ],
            where: {
                userId,
                ...option
            },
            ...limit,
            order:[[literal('FriendId.name'), 'ASC']]
        });
        if (friends){
            return [friends, "SUCCESS"];
        }else{
            return ["This userId has not friends", "FAILURE"];
        }
    }catch(error){
        return [error, "ERROR"];
    }

}

const getTotalFriendFromUserId = async(userId) => {
    try{
        const count = await Friend.count({
            where: {
                userId
            }
        });
        return [count, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }
}

module.exports.register = register;
module.exports.verify = verify;
module.exports.getFriendFromUserId = getFriendFromUserId;
module.exports.getTotalFriendFromUserId = getTotalFriendFromUserId;
module.exports.remove = remove;