import axios from "axios";

const f1Api = axios.create({
  baseURL: "https://api.openf1.org/v1",
});

export const getDrivers = async () => {
  try {
    const response = await f1Api.get("/drivers", {
      params: {
        session_key: "latest",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching drivers:", error);
    throw error;
  }
};

export const fetchDriverIntervals = async () => {
  try {
    const response = await f1Api.get("/intervals", {
      params: {
        session_key: "latest",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching intervals:", error);
    throw error;
  }
};

export const getDriverPositions = async () => {
  try {
    const response = await f1Api.get("/positions", {
      params: {
        session_key: "latest",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching positions:", error);
    throw error;
  }
};

export const getStintInfo = async () => {
  try {
    const response = await f1Api.get("/stints", {
      params: {
        session_key: "latest",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching stint info:", error);
    throw error;
  }
};

export default {
  getDrivers,
  getDriverPositions,
  getStintInfo,
  fetchDriverIntervals,
};
