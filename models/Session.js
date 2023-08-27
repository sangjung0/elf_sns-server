const Sequelize = require('sequelize');

class Session extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            id:{
                type: Sequelize.STRING(45),
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            expires: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                unique: false
            }
        },{
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Session',
            tableName: 'sessions',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        })
    }
    static associate(db){
        db.Session.belongsTo(db.User, {foreignKey: 'userId', targetKey: "id"});
    }
};

module.exports = Session;