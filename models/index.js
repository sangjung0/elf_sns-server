const Sequelize = require('sequelize');
const Session = require('./Session');
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Image = require('./Image');

require('dotenv').config();
const config = JSON.parse(process.env.DATABASE_ACCOUNT);
const db = {};

const sequelize = new Sequelize(config.database, config.user, config.password, config);

db.sequelize = sequelize;

db.User = User;
db.Session = Session;
db.Post = Post;
db.Comment = Comment;
db.Image = Image;

User.init(sequelize);
Session.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
Image.init(sequelize);

User.associate(db);
Session.associate(db);
Post.associate(db);
Comment.associate(db);
Image.associate(db);

//친구관계
db.FriendlyRelationship = db.sequelize.models.FriendlyRelationship;

module.exports = db;