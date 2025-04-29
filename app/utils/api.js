import axios from "axios";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let DEFAULT_DELAY = 60000;

const openF1Api = axios.create({
  baseURL: "https://api.openf1.org/v1",
});

const jolpicaAPI = axios.create({
  baseURL: "https://api.jolpi.ca/ergast/f1",
});

const initialFetchComplete = {
  drivers: false,
  intervals: false,
  position: false,
  stints: false,
};

export const getDrivers = async () => {
  try {
    const response = await openF1Api.get("/drivers", {
      params: {
        session_key: "latest",
      },
    });

    // if not first call, apply delay
    if (initialFetchComplete.drivers) {
      await delay(DEFAULT_DELAY);
    } else {
      initialFetchComplete.drivers = true;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching drivers:", error);
    throw error;
  }
};

export const fetchDriverIntervals = async () => {
  try {
    const response = await openF1Api.get("/intervals", {
      params: {
        session_key: "latest",
      },
    });

    if (initialFetchComplete.intervals) {
      await delay(DEFAULT_DELAY);
    } else {
      initialFetchComplete.intervals = true;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching intervals:", error);
    throw error;
  }
};

export const getDriverPositions = async () => {
  try {
    const meetingKey = "latest";

    const response = await openF1Api.get("/position", {
      params: {
        session_key: "latest",
        meeting_key: meetingKey,
      },
    });

    if (initialFetchComplete.position) {
      await delay(DEFAULT_DELAY);
    } else {
      initialFetchComplete.position = true;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching positions:", error);
    throw error;
  }
};

export const getStintInfo = async () => {
  try {
    const response = await openF1Api.get("/stints", {
      params: {
        session_key: "latest",
      },
    });

    if (initialFetchComplete.stints) {
      await delay(DEFAULT_DELAY);
    } else {
      initialFetchComplete.stints = true;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching stint info:", error);
    throw error;
  }
};

export const getRaceCalendar = async () => {
  try {
    const response = await jolpicaAPI.get("/2025/races.json");
    //console.log(response.data.MRData.RaceTable);
    return response.data.MRData.RaceTable;
  } catch (error) {
    console.error("Error fetching  race calendar:", error);
    throw error;
  }
};

getRaceCalendar();

export default {
  getDrivers,
  getDriverPositions,
  getStintInfo,
  fetchDriverIntervals,
  getRaceCalendar,
};
