module.exports = (sequelize, DataTypes) => {
  const cols = {
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
  };

  const config = {
    underscored: true,
  };

  const User = sequelize.define('User', cols, config);

  User.associate = (models) => {
    User.hasMany(models.Comment, {
      as: 'comments',
      foreignKey: 'user_id',
    });
    User.hasMany(models.Product, {
      as: 'products',
      foreignKey: 'user_id',
    });
  };

  return User;
};
