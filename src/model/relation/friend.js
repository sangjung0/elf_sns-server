const {FriendlyRelationship} = require(process.env.SERVER_PATH + "/models");
const {Op} = require('sequelize');

const register = async (userId1, userId2) => {
    try{
        const [data,state] = await verify(userId1, userId2);
        if(state !== "FAILURE"){
            throw data;
        }

        await FriendlyRelationship.create({
            UserId: userId1,
            FriendId: userId2
        });
        return [null, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }
}

const verify = async (userId1, userId2) => {
    try{
        const user = await FriendlyRelationship.findOne({
            where: {
                [Op.or]: [
                  { UserId: userId1, FriendId: userId2 },
                  { UserId: userId2, FriendId: userId1 }
                ]
            },
        });

        if (user){
            return [user.dataValues, "SUCCESS"];
        }else{
            return ["Friend relationship does not exist.", "FAILURE"];
        }
    }catch(error){
        return [error, "ERROR"];
    }
}

const getFriendIdFromUserId = async(userId) => {
    try{
        const friends = await FriendlyRelationship.findAll({
            where: {
                [Op.or]: [
                  { UserId: userId },
                  { FriendId: userId }
                ]
            },
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

module.exports.register = register;
module.exports.verify = verify;
module.exports.getFriendIdFromUserId = getFriendIdFromUserId;