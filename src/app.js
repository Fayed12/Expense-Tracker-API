// local
const expensesRouter = require("./modules/expensesRoutes")

// express
const express = require("express")

// 3rd party
const cors = require("cors")
const helmet = require("helmet")

const app = express()

app.use("/api/expenses", expensesRouter)

app.use(cors({
    origin:"http:127.0.0.1:5173"
}))

app.use(helmet())

app.get("/", (req, res) => {
    res.send("hello")
})

module.exports = app