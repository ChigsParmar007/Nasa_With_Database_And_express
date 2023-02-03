const {
    getAllLaunches,
    ScheduleNewLaunch,
    existLaunchWithId,
    abortLaunchId,
} = require('../../models/launches_model')

const {
    getPagination
} = require('../../services/query')

const httpGetAllLaunches = async (req, res) => {
    const { skip, limit } = getPagination(req.query)
    const launches = await getAllLaunches(skip, limit)
    return res.status(200).json(launches)
}

const httpAddNewLaunch = async (req, res) => {
    const launch = await req.body
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target)
        return res.status(400).json({
            error: 'Missing required launch property'
        })

    launch.launchDate = new Date(launch.launchDate)
    if (isNaN(launch.launchDate))
        return res.status(404).json({
            error: 'Invalid launch date'
        })

    await ScheduleNewLaunch(launch)
    return res.status(201).json(launch)
}

async function httpAbbortLaunch(req, res) {
    const launchId = Number(req.params.id)
    const existLaunch = await existLaunchWithId(launchId)
    if (!existLaunch) {
        return res.status(404).json({
            error: 'Launch does not exist'
        })
    }

    const aborted = await abortLaunchId(launchId)
    if (!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted'
        })

    }

    return res.status(200).json({
        ok: true,
    })
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbbortLaunch,
}