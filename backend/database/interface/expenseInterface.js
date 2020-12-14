//TODO: methods such as delete and update should return the expense, rather than return nothing
const models = require("../models");
const Expense = models.Expense;
/**
 * Fetch all expenses matching filter as json
 *
 */
async function getExpenses(filter = {}) {
  return await Expense.findAll(filter);
}

/**
 * Add expenses to database
 * @param {Array} data - Data of the expense to be added
 */
async function addExpenses(data) {
  return await Expense.bulkCreate(data);
}
/**
 * Delete expenses matching filter
 * @param {Object} filter - Filter expenses
 */
async function deleteExpenses(filter) {
  try {
    await Expense.destroy({
      where: filter,
    });
  } catch (err) {
    console.log(err);
    throw err
  }
}
/**
 * Updates expenses matching filter in the database
 * @param {Object} data - Fields to update
 * @param {Object} filter - Filter expenses
 */
async function updateExpenses(data, filter) {
  try {
    await Expense.update(data, {
      where: filter,
    });
  } catch (err) {
    console.log(err);
    throw err
  }
}
module.exports = {
  getExpenses,
  addExpenses,
  deleteExpenses,
  updateExpenses 
};
