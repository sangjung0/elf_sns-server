const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id:{
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            content:{
                type: Sequelize.TEXT,
                allowNull: false,
            },
            likeCount: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }
    static associate(db){
        db.Post.belongsTo(db.User, {foreignKey: 'userId', targetKey: "id"});
        db.Post.hasMany(db.Image, {foreignKey: 'postId', sourceKey: "id"});
        db.Post.hasMany(db.Comment, {foreignKey: 'postId', sourceKey: "id"});
    }
};

module.exports = Post;