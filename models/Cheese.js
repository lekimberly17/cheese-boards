const {sequelize} = require('../db');
const { Sequelize } = require('sequelize');


// TODO - define the Cheese model
let Cheese;

Cheese = sequelize.define('Cheese', {
    title: Sequelize.STRING,
    description: Sequelize.STRING
})


module.exports = {
    Cheese
};