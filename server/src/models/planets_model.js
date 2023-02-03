const fs = require("fs")
const path = require("path")
const { parse } = require("csv-parse")

const planets = require("./planets_schema")

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  )
}

const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanets(data)
        }
      })
      .on("error", (err) => {
        console.log(err)
        reject(err)
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length
        console.log(`${countPlanetsFound} habitable planets found!`)
        resolve()
      })
  })
}

const savePlanets = async (planet) => {
  try {
    await planets.updateOne({
      KeplerName: planet.kepler_name,
    }, {
      KeplerName: planet.kepler_name
    }, {
      upsert: true,
    })
  }
  catch (err) {
    console.error(`Could not save planets : ${err}`)
  }
}
const getAllPlanets = async () => {
  return await planets.find({}, {
    '_id': 0,
    '__v': 0
  })
}
module.exports = {
  loadPlanetsData,
  getAllPlanets
}
