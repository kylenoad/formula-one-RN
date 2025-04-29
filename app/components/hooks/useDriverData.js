import { useState, useRef, useEffect } from "react";
import { getDrivers, getDriverPositions, getStintInfo } from "../../utils/api";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

export const useDriverData = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stintCache = useRef({});

  useEffect(() => {
    const fetchInitialDrivers = async () => {
      try {
        const driverData = await getDrivers();
        setDrivers(driverData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialDrivers();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const updatePositions = async () => {
        try {
          const positionData = await getDriverPositions();

          const positionMap = positionData.reduce((map, entry) => {
            const driverNum = entry.driver_number;
            const current = map[driverNum];

            if (!current || new Date(entry.date) > new Date(current.date)) {
              map[driverNum] = entry;
            }

            return map;
          }, {});

          setDrivers((current) => {
            const updated = current.map((driver) => {
              const latest = positionMap[driver.driver_number];
              return {
                ...driver,
                position: latest?.position ?? driver.position,
              };
            });

            return updated.sort((a, b) => a.position - b.position);
          });
        } catch (err) {
          console.log("Error fetching positions:", err.message);
        }
      };

      const updateStints = async () => {
        try {
          const stintData = await getStintInfo();

          stintData.forEach((stint) => {
            const driverNum = stint.driver_number;
            const existing = stintCache.current[driverNum] || [];

            const isDuplicate = existing.some(
              (s) =>
                s.lap_start === stint.lap_start &&
                s.lap_end === stint.lap_end &&
                s.tyre === stint.tyre
            );

            if (!isDuplicate) {
              stintCache.current[driverNum] = [...existing, stint];
            }
          });

          setDrivers((current) =>
            current.map((driver) => ({
              ...driver,
              stints: stintCache.current[driver.driver_number] || [],
            }))
          );
        } catch (err) {
          console.log("Error fetching stints:", err.message);
        }
      };

      updatePositions();
      updateStints();

      const posInterval = setInterval(updatePositions, 5000);
      const stintInterval = setInterval(updateStints, 30000);

      return () => {
        clearInterval(posInterval);
        clearInterval(stintInterval);
      };
    }, [drivers.length])
  );

  return { drivers, loading, error };
};
