// local
const expensesRouter = require("./modules/expensesRoutes")

// express
const express = require("express")

const app = express()

app.use("/api/expenses", expensesRouter)

app.get("/", (req, res) => {
    res.send("hello")
})

module.exports = app