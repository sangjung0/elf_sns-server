const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id:{
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
                validate: {
                  isEmail: true
                }
            },
            password:{
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            name:{
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            phoneNumber:{
                type: Sequelize.STRING(30),
                allowNull: false,
                unique: true,
                validate: {
                  is: /^[0-9]{10,11}$/
                }
            },
            imageUrl:{
                type: Sequelize.STRING(255),
                allowNull: false,
            }
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }
    static associate(db){
        db.User.hasMany(db.Comment, {foreignKey: 'userId', sourceKey: "id"});
        db.User.hasMany(db.Post, {foreignKey: 'userId', sourceKey: "id"});
        db.User.hasOne(db.Session, {foreignKey: 'userId', sourceKey: "id"});
        db.User.belongsToMany(db.User, { as: "Friends", through: 'FriendlyRelationship'})
    }
};

module.exports = User;