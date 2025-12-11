// =============================================
// ITEM VALIDATORS (Create, Update)
// =============================================

const { body } = require("express-validator");

// CREATE ITEM VALIDATOR
const createItemValidator = [];

// UPDATE ITEM VALIDATOR
const updateItemValidator = [];

module.exports = {
  createItemValidator,
  updateItemValidator,
};
