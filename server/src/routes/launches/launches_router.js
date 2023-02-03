const express = require('express')
const {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbbortLaunch,
} = require('./launches_controller')

const launchesRouter = express.Router()

launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', httpAddNewLaunch)
launchesRouter.get('/:id',)
launchesRouter.delete('/:id', httpAbbortLaunch)

module.exports = launchesRouter