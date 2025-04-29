import { useState, useEffect } from "react";
import { getRaceCalendar } from "../../utils/api";

export const useCalendarData = () => {
  const [calendar, setCalendar] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRaceCalendar = async () => {
      try {
        const raceData = await getRaceCalendar();

        setCalendar(raceData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRaceCalendar();
  }, []);

  return { calendar, error };
};
