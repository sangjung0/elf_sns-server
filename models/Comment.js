const Sequelize = require('sequelize');

class Comment extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id:{
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            content:{
                type: Sequelize.STRING(255),
                allowNull: false,
            }
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Comment',
            tableName: 'comments',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }
    static associate(db){
        db.Comment.belongsTo(db.Post, {foreignKey: 'postId', targetKey: "id"});
        db.Comment.belongsTo(db.User, {foreignKey: 'userId', targetKey: "id"});
    }
};

module.exports = Comment;