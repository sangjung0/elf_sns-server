const Sequelize = require('sequelize');

class Image extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id:{
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            url:{
                type: Sequelize.STRING(255),
                allowNull: false,
            }
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Image',
            tableName: 'images',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }
    static associate(db){
        db.Image.belongsTo(db.Post, {foreignKey: 'postId', targetKey: "id"});
    }
};

module.exports = Image;