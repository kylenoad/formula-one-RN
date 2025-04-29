import React from "react";
import { FlatList, ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";
import { useDriverData } from "./hooks/useDriverData";
import DriverItem from "./DriverItem";

const DriversList = () => {
  const { drivers, loading, error } = useDriverData();

  const router = useRouter();

  const handleDriverPress = (driver) => {
    router.push(
      `/driver/${driver.driver_number}?name=${encodeURIComponent(
        driver.full_name
      )}`
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  if (error) return <Text className="text-red-500">Error: {error}</Text>;

  if (drivers.length === 0)
    return <Text className="text-center p-4">No drivers found</Text>;

  return (
    <FlatList
      className="pl-4 pr-4"
      data={drivers}
      keyExtractor={(item) => item.driver_number.toString()}
      renderItem={({ item }) => (
        <DriverItem driver={item} onPress={() => handleDriverPress(item)} />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default DriversList;
