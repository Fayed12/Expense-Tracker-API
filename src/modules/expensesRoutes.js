// express
const express = require("express")

// local
const expensesData = require("../services/readExpensesData")
const isValidDate = require("../services/ValidateDate")
const { getAllData, getExpenseById, getSummary, createNewExpense, updateExpense, deleteItem } = require("../modules/controllers")

const expensesRouter = express.Router()

// convert http request data chinks buffers to json data 
expensesRouter.use(express.json())

// Error handling middleware
expensesRouter.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            message: "Malformed JSON body"
        });
    }

    next(err);
});

// check to all expenses data is exist
expensesRouter.use((req, res, next) => {
    if (expensesData.length <= 0) {
        return res.status(404).send({
            status: "failed",
            message: "no data found!"
        })
    }

    next()
})

// check to id exist and has dataanti
function checkParam(req, res, next) {
    const { id } = req.params
    
    if (!id) {
        return res.status(404).send({
            status: "failed",
            message: "id not found!"
        })
    }

    const idJsonData = expensesData.find((exp) => exp.id === id)

    if (!idJsonData?.id) {
        return res.status(404).send({
            status: "failed",
            message: "this id is not exist, try another one!"
        })
    }

    req.body = idJsonData

    next()
}

// check req body to create new expense
const checkReqBody = (req, res, next) => {
    const newExpenseData = req.body

    if (!newExpenseData) {
        return res.status(400).send({
            status: "failed",
            message: "please insert your data to start create new expense! "
        })
    }

    if (!newExpenseData.title || !newExpenseData.amount || !newExpenseData.category || !newExpenseData.date) {
        return res.status(400).send({
            status: "failed",
            message: "missing value! "
        })
    }

    if (typeof newExpenseData.amount !== "number") {
        return res.status(400).send({
            status: "failed",
            message: "please insert number value to amount "
        })
    }

    isValidDate(newExpenseData.date, res)

    next()
}

// routes
expensesRouter.route("/").get(getAllData).post(checkReqBody, createNewExpense)

expensesRouter.get("/summary", getSummary)

expensesRouter.route("/:id").get(checkParam, getExpenseById).patch(updateExpense).delete(checkParam,deleteItem)



module.exports = expensesRouter