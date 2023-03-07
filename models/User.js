const {sequelize} = require('../db');
const { Sequelize } = require('sequelize');


// TODO - define the User model
let User;

User = sequelize.define('User', {
    name: Sequelize.STRING,
    email: Sequelize.STRING
})




module.exports = {
    User
};