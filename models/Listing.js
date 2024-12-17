const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const User = require('./User');

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  latitude: DataTypes.DOUBLE,
  longitude: DataTypes.DOUBLE,
  user_id: {
    type: DataTypes.BIGINT,
    references: {
      model: User,
      key: 'id',
    },
  },
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
}, {
  tableName: 'listings',
  timestamps: false,
});

// Define association
Listing.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Listing;
