const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  listingType: {
    type: DataTypes.ENUM('sell', 'rent'),
    defaultValue: 'sell',
  },
  category: {
    type: DataTypes.STRING, // Books, Electronics, Furniture, Clothing, Vehicles, Other
    allowNull: false,
  },
  condition: {
    type: DataTypes.STRING, // New, Like New, Good, Fair
    allowNull: false,
  },
  images: {
    type: DataTypes.JSON, // Array of image URLs/paths
    defaultValue: [],
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('available', 'reserved', 'sold'),
    defaultValue: 'available',
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending',
  },
  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  reservedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  reservedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  soldAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Listing;
