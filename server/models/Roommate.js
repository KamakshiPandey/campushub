const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Roommate = sequelize.define('Roommate', {
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
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genderPreference: {
    type: DataTypes.ENUM('any', 'male', 'female'),
    defaultValue: 'any',
  },
  moveInDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  amenities: {
    type: DataTypes.JSON, // e.g. ["WiFi", "AC", "Laundry", "Parking"]
    defaultValue: [],
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'fulfilled', 'removed'),
    defaultValue: 'active',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Roommate;
