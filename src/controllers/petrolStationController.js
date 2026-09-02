import { createStation, listStations, getStation } from "../services/petrolStationService.js";


export const createPetrolStation = async (req, res, next) => {
  try {
    const station = createStation(req.body);

    return res.status(201).json({
      success: true,
      message: "Petrol station created successfully",
      data: station,
    });
  } catch (error) {
    next(error);
  }
};



export const getPetrolStations = async (req, res, next) => {
  try {
    const {
      latitude,
      longitude,
      radiusKm,
    } = req.query;

    const options = {};

    if (latitude !== undefined) {
      options.latitude = Number(latitude);
    }

    if (longitude !== undefined) {
      options.longitude = Number(longitude);
    }

    if (radiusKm !== undefined) {
      options.radiusKm = Number(radiusKm);
    }

    const stations = listStations(options);

    return res.status(200).json({
      success: true,
      count: stations.length,
      data: stations,
    });
  } catch (error) {
    next(error);
  }
};


export const getPetrolStationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const station = getStation(id);

    return res.status(200).json({
      success: true,
      data: station,
    });
  } catch (error) {
    next(error);
  }
};