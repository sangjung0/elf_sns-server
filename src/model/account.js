const {User} = require(process.env.SERVER_PATH + "/models");
const {Op, literal} = require('sequelize');

const register = async (email, password, name, phoneNumber, imageUrl) => {
    try{
        const rows = await User.findAll({
            where: {
                email: email,
            },
        });
        if (rows.length === 0){
            await User.create({
                email,
                password,
                name,
                phoneNumber,
                imageUrl
            });
            return [null, "SUCCESS"];
        }else{
            return ["already exist email", "FAILURE"];
        }
    }catch(error){
        return [error, "ERROR"];
    }
}

const verify = async (email, password) => {
    try{
        const user = await User.findOne({
            where: {
                email: email,
                password: password
            },
        });
        if (user){
            return [user.dataValues.id, "SUCCESS"];
        }else{
            return ["user does not exist.", "FAILURE"];
        }
    }catch(error){
        return [error, "ERROR"];
    }
}

const userList = async () => {
    try{
        const rows = await User.findAll();
        return [rows, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }
}


const getUserInfoByUserId = async (id) => {
    try{
        const user = await User.findOne({
            where:{
                id,
            }
        });
        if (user){
            return [user.dataValues, "SUCCESS"];
        }else{
            return [new Error("user not found"), "FAILURE"];
        }
    }catch(error){
        return [error, "ERROR"];
    }
}

const searchUser = async(string, currentName=null, requestValue=null) => {
    try{
        const option = currentName ? {[Op.and]: literal(`name > '${currentName}'`)}: {};
        const limit = requestValue ? {limit: requestValue} : {};
        const users = await User.findAll({
            where: {
                name:{
                    [Op.like]: `%${string}%`
                },
                ...option
            },
            order:[
                ['name', 'ASC']
              ],
            ...limit,
        });
        return [users, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }
}

const getTotalUserByIncludeString = async (string) => {
    try{
        const count = await User.count({
            where: {
                name:{
                    [Op.like]: `%${string}%`
                },
            },
        });
        return [count, "SUCCESS"];
    }catch(error){
        return [error, "ERROR"];
    }

}

module.exports.register = register;
module.exports.userList = userList;
module.exports.verify = verify;
module.exports.getUserInfoByUserId = getUserInfoByUserId;
module.exports.searchUser = searchUser;
module.exports.getTotalUserByIncludeString = getTotalUserByIncludeString;