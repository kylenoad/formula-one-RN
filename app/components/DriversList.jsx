import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getDrivers, getDriverPositions, getStintInfo } from "../utils/api";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native"; // Import necessary hook

const DriversList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const stintCache = useRef({});

  // Fetch static driver info once
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

  // Polling for positions (every 5s) and stints (every 30s)
  useFocusEffect(
    React.useCallback(() => {
      if (drivers.length === 0) return;

      const updatePositions = async () => {
        try {
          const positionData = await getDriverPositions();
          const positionMap = {};
          positionData.forEach((p) => {
            positionMap[p.driver_number] = p.position;
          });

          setDrivers((current) =>
            [...current]
              .map((driver) => ({
                ...driver,
                position: positionMap[driver.driver_number] ?? driver.position,
              }))
              .sort((a, b) => a.position - b.position)
          );
        } catch (err) {
          console.log("Error fetching positions:", err.message);
        }
      };

      const updateStints = async () => {
        try {
          const stintData = await getStintInfo();
          const newCache = {};

          stintData.forEach((stint) => {
            const number = stint.driver_number;
            if (!newCache[number]) newCache[number] = [];
            newCache[number].push(stint);
          });

          stintCache.current = newCache;

          setDrivers((current) =>
            [...current].map((driver) => ({
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
    }, [drivers.length]) // Dependencies: only refetch when drivers data is available
  );

  const handleDriverPress = (driver) => {
    router.push(
      `/driver/${driver.driver_number}?name=${encodeURIComponent(
        driver.full_name
      )}`
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text className="text-red-500">Error: {error}</Text>;

  return (
    <FlatList
      data={drivers}
      keyExtractor={(item) => item.driver_number.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handleDriverPress(item)}
          activeOpacity={0.7}
        >
          <View
            className={`flex-row items-center p-4 my-2 rounded-lg`}
            style={{ backgroundColor: `#${item.team_colour}99` }}
          >
            <View className="flex-shrink-0">
              <Text className="text-red-600 text-4xl font-bold">
                #{item.position}
              </Text>
            </View>
            <Image
              source={{ uri: item.headshot_url }}
              className="w-16 h-16 rounded-full mr-4"
            />
            <View>
              <Text className="text-lg font-bold mt-0">{item.full_name}</Text>
              <Text className="text-grey-700">{item.team_name}</Text>

              {item.stints && item.stints.length > 0 && (
                <View>
                  {item.stints.map((stint, index) => (
                    <Text key={index} className="text-white">
                      Stint #{stint.stint_number}: Lap {stint.lap_start}-
                      {stint.lap_end} ({stint.compound} Tyre)
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default DriversList;
