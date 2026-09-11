// node
const fs = require("node:fs")

// local
const expensesData = require("../services/readExpensesData")

exports.getAllData = (req, res) => {
    const { category, from, to } = req.query

    let results = expensesData

    if (category) {
        results = results.filter((exp) => {
            return exp.category.trim().toLowerCase() === category.trim().toLowerCase()
        })
    }

    if (from) {
        const fromDate = new Date(from)

        results = results.filter((exp) => {
            const expenseDate = new Date(exp.date)

            return expenseDate >= fromDate
        })
    }

    if (to) {
        const toDate = new Date(from)

        results = results.filter((exp) => {
            const expenseDate = new Date(exp.date)

            return expenseDate <= toDate
        })
    }

    if (results.length <= 0) {
        return res.status(404).send({
            status: "failed",
            message: "no data found!"
        })
    }

    res.status(200).json({
        status: "success",
        data: results
    })
}

exports.getSummary = (req, res) => {
    const totalPrices = expensesData.reduce((acc, curr) => {
        return acc + curr?.amount
    }, 0)

    let categoriesArr = []
    expensesData.forEach((exp) => {
        categoriesArr.push({ cat: exp.category, price: exp.amount })
    })

    const byCategory = categoriesArr.reduce((acc, curr) => {

        if (acc[curr.cat]) {
            acc[curr.cat] += curr.price
        } else {
            acc[curr.cat] = curr.price
        }

        return acc
    }, {})

    res.status(200).json({
        status: "success",
        data: {
            total: totalPrices,
            byCategory
        }
    })
}

exports.getExpenseById = (req, res) => {
    const neededData = req.body

    res.status(200).json({
        status: "success",
        data: [neededData]
    })
}

exports.createNewExpense = (req, res) => {
    const newExpenseData = req.body

    const newExpense = {
        id: crypto.randomUUID(),
        title: newExpenseData.title,
        amount: newExpenseData.amount,
        category: newExpenseData.category,
        date: newExpenseData.date
    }

    expensesData.push(newExpense)

    fs.writeFile(`${__dirname}/../../data/expenses.json`, JSON.stringify(expensesData), (err) => {
        if (err) {
            return res.status(500).send({
                status: "failed",
                message: "server error!"
            })
        }

        res.status(201).send({
            status: "success",
            location:`get /api/expenses/${newExpense.id}`,
            data: expensesData
        })
    })
}

exports.updateExpense = (req, res) => {
    const { id, ...newData } = req.body;

    const reqParam = req.params

    if (!reqParam.id) {
        return res.status(404).send({
            status: "failed",
            message: "id not found!"
        })
    }

    const idJsonData = expensesData.find((exp) => exp.id === reqParam.id)

    if (!idJsonData?.id) {
        return res.status(404).send({
            status: "failed",
            message: "this id is not exist, try another one!"
        })
    }

    if (newData.id) {
        return res.status(400).send({
            status: "failed",
            message: "you can not update id!"
        })
    }

    const changedFields = {};

    for (const key in newData) {
        if (newData[key] !== idJsonData[key]) {
            changedFields[key] = newData[key];
        }
    }

    if (Object.keys(changedFields).length === 0) {
        return res.status(400).send({
            status: "failed",
            message: "nothing to update all values are the same"
        })
    }

    Object.assign(idJsonData, newData)

    fs.writeFile(`${__dirname}/../../data/expenses.json`, JSON.stringify(expensesData), (err) => {
        if (err) {
            return res.status(500).send({
                status: "failed",
                message: "server error!"
            })
        }

        res.status(200).send({
            status: "success",
            location:`get /api/expenses/${idJsonData.id}`,
            data: expensesData
        })
    })
}

exports.deleteItem = (req, res) => {
    const bodyData = req.body
    const oldExpenseIndex = expensesData.findIndex((exp) => exp.id === bodyData.id)

    if (oldExpenseIndex === -1) {
        return res.status(404).send({
            status: "failed",
            message: "data not found!"
        })
    }

    expensesData.splice(oldExpenseIndex, 1);

    fs.writeFile(`${__dirname}/../../data/expenses.json`, JSON.stringify(expensesData), (err) => {
        if (err) {
            return res.status(500).send({
                status: "failed",
                message: "server error!"
            })
        }

        res.status(200).send({
            status: "success",
            data: expensesData
        })
    })
    
}