// node
const fs = require("node:fs")

const expensesData = JSON.parse(fs.readFileSync(`${__dirname}/../../data/expenses.json`))

module.exports =  expensesData