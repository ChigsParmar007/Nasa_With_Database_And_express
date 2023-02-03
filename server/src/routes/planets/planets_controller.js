const { getAllPlanets } = require('../../models/planets_model')

const httpGetAllPlanets = async (req, res) => {
    return res.status(200).json(await getAllPlanets())
}

module.exports = {
    httpGetAllPlanets
}