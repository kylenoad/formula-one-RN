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
