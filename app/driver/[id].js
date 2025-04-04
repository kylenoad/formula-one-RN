import React, { useState, useEffect, useRef } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchDriverIntervals } from "../utils/api";
import { useFocusEffect } from "@react-navigation/native";

export default function DriverDetail() {
  const { id, name } = useLocalSearchParams();
  const [intervals, setIntervals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFocused = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      isFocused.current = true;
      return () => {
        isFocused.current = false;
      };
    }, [])
  );

  useEffect(() => {
    const fetchIntervalsData = async () => {
      if (!isFocused.current) return;

      try {
        const data = await fetchDriverIntervals();

        const driverInterval = data.find(
          (interval) => interval.driver_number === parseInt(id)
        );
        setIntervals(driverInterval);
      } catch (err) {
        console.error("Error fetching driver intervals:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIntervalsData();

    const intervalId = setInterval(() => {
      if (isFocused.current) {
        fetchIntervalsData();
      }
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text className="text-red-500">Error: {error}</Text>;
  }

  if (!intervals) {
    return (
      <Text className="text-gray-500">
        No interval data available for this driver.
      </Text>
    );
  }

  return (
    <View className="flex-1 p-4 bg-gray-700 items-center justify-start">
      <Text className="text-2xl font-bold text-white mt-4">{name}</Text>
      <Text className="text-lg text-gray-300 mt-2">Driver #{id}</Text>

      <Text className="text-lg text-white mt-4">
        Gap to Leader:{" "}
        {intervals?.gap_to_leader ? intervals.gap_to_leader : "No data"}
      </Text>
    </View>
  );
}
