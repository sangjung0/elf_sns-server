const Sequelize = require('sequelize');

class Friend extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id:{
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Friend',
            tableName: 'friends',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }
    static associate(db){
        db.Friend.belongsTo(db.User, {foreignKey: 'friendId', targetKey: "id", as:"FriendId"});
        db.Friend.belongsTo(db.User, {foreignKey: 'userId', targetKey: "id",  as:"UserId"});
    }
};

module.exports = Friend;