const {sequelize} = require('../db');
const { Sequelize } = require('sequelize');

// TODO - define the Board model
let Board;

Board = sequelize.define('Board', {
    type: Sequelize.STRING,
    description: Sequelize.STRING,
    rating: Sequelize.NUMBER
})


module.exports = {
    Board
};