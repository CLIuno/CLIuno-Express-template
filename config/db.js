const { Sequelize } = require('sequelize');
// Option 1: Passing a connection URI
const sequelize = new Sequelize(
    'postgresql://postgres:WpqxnVcQEAae52iCtvTi@containers-us-west-115.railway.app:6792/railway')

sequelize.sync();
try {
  await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}