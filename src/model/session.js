const {Session} = require(process.env.SERVER_PATH + "/models");

const register = async (sessionId, expires, userId) => {
    try{
        const [data,status] = await verify(sessionId);
        switch (status){
            case "SUCCESS":
                await Session.update({
                    expires: expires,
                    userId
                },{
                    where: {
                        id: sessionId
                    }
                })
                return [null, "SUCCESS"];
            case "FAILURE":
                removeByuserId(userId);
                await Session.create({
                    id: sessionId,
                    expires: expires,
                    userId
                });
                return [null, "SUCCESS"];
            default:
                throw data;
        }
    }catch(error){
        return [error, "ERROR"];
    }
}

const verify = async (sessionId) => {
    try{
        const session = await Session.findOne({
            where:{
                id:sessionId,
            }
        })
        if (session){
            return [session.dataValues, "SUCCESS"];
        }else{
            return [null, "FAILURE"];
        }
    }catch(error){
        return [error, "ERROR"];
    }
}

const removeByuserId = async (userId) => {
    try{
        const session = await Session.findOne({
            where:{
                userId:userId,
            }
        })
        await session.destroy();
        return [null, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }

}

module.exports.register = register;
module.exports.verify = verify;