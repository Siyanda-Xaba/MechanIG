import * as fuelRequestService from "../services/fuelRequestService.js";


export const createFuelRequest = async (req, res, next) => {
  try {
    const customerId = req.user?.id;

    const {
      fuelType,
      litres,
      latitude,
      longitude,
      deliveryAddress,
      scheduledFor,
    } = req.body;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required",
      });
    }

    if (!fuelType?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Fuel type is required",
      });
    }

    const amount = Number(litres);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Litres must be a positive number",
      });
    }

    const latitudeNumber = Number(latitude);
    const longitudeNumber = Number(longitude);

    if (
      !Number.isFinite(latitudeNumber) ||
      !Number.isFinite(longitudeNumber)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required",
      });
    }

    const fuelRequest =
      fuelRequestService.createFuelRequest({
        customerId,
        fuelType,
        litres: amount,

        deliveryLocation: {
          latitude: latitudeNumber,
          longitude: longitudeNumber,
          address: deliveryAddress || null,
        },

        scheduledFor: scheduledFor || null,
      });

    return res.status(201).json({
      success: true,
      message: "Fuel request created successfully",
      data: fuelRequest,
    });
  } catch (error) {
    next(error);
  }
};



export const getMyFuelRequests = async (req, res, next) => {
  try {
    const customerId = req.user?.id;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required",
      });
    }

    const requests =
      fuelRequestService.listFuelRequests({
        customerId,
      });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};


export const getFuelRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const fuelRequest =
      fuelRequestService.getFuelRequest(id);

    return res.status(200).json({
      success: true,
      data: fuelRequest,
    });
  } catch (error) {
    next(error);
  }
};



export const cancelFuelRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customerId = req.user?.id;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required",
      });
    }

    const request =
      fuelRequestService.getFuelRequest(id);

    if (request.customerId !== customerId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to cancel this request",
      });
    }

    if (
      request.status === "COMPLETED" ||
      request.status === "CANCELLED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Fuel request cannot be cancelled because it is already ${request.status}`,
      });
    }

    const cancelledRequest =
      fuelRequestService.updateFuelRequestStatus(
        id,
        "CANCELLED"
      );

    return res.status(200).json({
      success: true,
      message: "Fuel request cancelled successfully",
      data: cancelledRequest,
    });
  } catch (error) {
    next(error);
  }
};