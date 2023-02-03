const http = require('http')

require('dotenv').config()

const { mongoConnect } = require('./services/mongo')

const PORT = process.env.PORT || 5000

const app = require('./app')

const { loadPlanetsData } = require('./models/planets_model')

const { loadLaunchData } = require('./models/launches_model')

const server = http.createServer(app)

const startServer = async () => {
    await mongoConnect()
    await loadPlanetsData()
    await loadLaunchData()

    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })
}

startServer()