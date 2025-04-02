import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getDrivers } from "../api"; // Adjust the import path as needed
import { useRouter } from "expo-router";

const DriversList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await getDrivers();
        setDrivers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const handleDriverPress = (driver) => {
    // Use a simpler route format that's more likely to work with Expo Router
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
          <View className="flex-row items-center p-4 my-2 bg-gray-200 rounded-lg shadow-md">
            <Image
              source={{ uri: item.headshot_url }}
              className="w-16 h-16 rounded-full mr-4"
            />
            <View>
              <Text className="text-lg font-bold">{item.full_name}</Text>
              <Text className="text-gray-500">#{item.driver_number}</Text>
              <Text className="text-gray-500">{item.team_name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default DriversList;
