const axios = require('axios')
const launchSchema = require('./launches_schema')
const planets = require('./planets_schema')

const DEFAULT_FLIGHT_NUMBER = 100

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

const populateLaunches = async () => {
    console.log('Downloading launch data...')
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    })

    if (response.status !== 200) {
        console.log('Problem downloading lauch data')
        throw new Error('Lauch data download failed')
    }

    const launchDocs = response.data.docs

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads']
        const customer = payloads.flatMap((playload) => {
            return playload['customers']
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customer,
        }
        console.log(`${launch.flightNumber} ${launch.mission}`)
        await saveLaunch(launch)
    }
}
const loadLaunchData = async () => {
    const firstLaunch = await findLuanch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    })

    if (firstLaunch) {
        console.log('Launch Data already loaded')
    }
    else {
        await populateLaunches()
    }
}

const findLuanch = async (filter) => {
    return await launchSchema.findOne(filter)
}

const existLaunchWithId = (launchId) => {
    return findLuanch({
        flightNumber: launchId,
    })
}
const getLatestFlightNumber = async () => {
    const latestLaunch = await launchSchema.findOne().sort('-flightNumber')
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }
    return latestLaunch.flightNumber
}

const getAllLaunches = async (skip, limit) => {
    return await launchSchema
        .find({}, { '_id': 0, '__v': 0 })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit)
}

const saveLaunch = async (launch) => {
    await launchSchema.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    },
        launch, {
        upsert: true,
    })
}

const ScheduleNewLaunch = async (launch) => {
    const planet = await planets.findOne({
        KeplerName: launch.target,
    })

    if (!planet) {
        throw new Error(`Planet ${launch.target} not found`)
    }

    const newFlightNumber = await getLatestFlightNumber() + 1
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customer: ['Zero to Mastery', 'NASA'],
        flightNumber: newFlightNumber,
    })

    await saveLaunch(newLaunch)
}

const abortLaunchId = async (launchId) => {
    const aborted = await launchSchema.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    })

    return aborted.matchedCount === 1 && aborted.modifiedCount === 1
}

module.exports = {
    ScheduleNewLaunch,
    getAllLaunches,
    existLaunchWithId,
    abortLaunchId,
    loadLaunchData
}