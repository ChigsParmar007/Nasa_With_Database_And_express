const express = require('express')

const planetsRouter = require("./planets/planets_router")
const launchesRouter = require("./launches/launches_router")

const api = express.Router()

api.use('/planets', planetsRouter)
api.use('/launches', launchesRouter)

module.exports = api
