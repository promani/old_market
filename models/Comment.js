module.exports = (sequelize, DataTypes) => {
  const cols = {
    content: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    product_id: {
      type: DataTypes.INTEGER,
    },
  };

  const Comment = sequelize.define('Comment', cols, { underscored: true });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Comment, {
      as: 'product',
      foreignKey: 'product_id',
    });
    Comment.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'user_id',
    });
  };

  return Comment;
};
