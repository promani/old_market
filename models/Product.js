module.exports = (sequelize, DataTypes) => {
  const cols = {
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.NUMBER,
    },
  };

  const config = {
    underscored: true,
  };

  const Product = sequelize.define('Product', cols, config);

  Product.associate = (models) => {
    Product.hasMany(models.Comment, {
      as: 'comments',
      foreignKey: 'product_id',
    });
    Product.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'user_id',
    });
  };

  return Product;
};
