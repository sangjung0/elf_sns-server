const {Friend} = require(process.env.SERVER_PATH + "/models");
const {Op} = require('sequelize');

const register = async (userId1, userId2) => {
    try{
        const [data,state] = await verify(userId1, userId2);
        if(state !== "FAILURE"){
            throw data;
        }
        if(data){
            await Friend.create({
                UserId: userId1,
                FriendId: userId2
            });
        }
        return [null, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }
}

const remove = async (id) => {
    try{
        await Friend.destroy({
            where: {
                id
            },
        });
        return [null, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }
}

const verify = async (userId1, userId2) => {
    try{
        const user = await Friend.findOne({
            where: {
                [Op.or]: [
                  { UserId: userId1, FriendId: userId2 },
                  { UserId: userId2, FriendId: userId1 }
                ]
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

const getFriendFromUserId = async(userId, currentId=null, value=null) => {
    try{
        const option = currentId ? {id: {[Op.lt]: currentId}}: {};
        const limit = value ? {limite: value} : {};
        const friends = await Friend.findAll({
            where: {
                [Op.or]: [
                  { UserId: userId },
                  { FriendId: userId }
                ],
                ...option
            },
            order:[
                ['id', 'DESC'] // 'id' 필드를 기준으로 내림차순 정렬
              ],
            ...limit,
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
                [Op.or]: [
                  { UserId: userId },
                  { FriendId: userId }
                ],
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