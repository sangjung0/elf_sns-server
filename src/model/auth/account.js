const {User} = require(process.env.SERVER_PATH + "/models");

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

const getIdByEmail = async (email) => {
    try{
        const rows = await User.findAll({
            where:{
                email:email,
            }
        });
        if (rows.length === 0){
            return [new Error("not found"), "error"];
        }else{
            return [rows[0], "completed"];
        }
    }catch(error){
        return [error, "error"];
    }
}

module.exports.register = register;
module.exports.userList = userList;
module.exports.verify = verify;
module.exports.getIdByEmail = getIdByEmail;