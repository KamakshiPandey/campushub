const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;

if (dialect === 'mysql' && process.env.DB_NAME) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
} else {
  // Default to SQLite for zero-config run capability on any machine
  const storagePath = process.env.DB_STORAGE
    ? path.resolve(__dirname, '..', process.env.DB_STORAGE)
    : path.resolve(__dirname, '../database.sqlite');

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Database connected successfully (${sequelize.getDialect().toUpperCase()})`);
    // Sync models
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');
  } catch (error) {
    console.error('❌ Database connection failure:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
