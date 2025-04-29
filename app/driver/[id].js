import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function DriverDetail() {
  const { name } = useLocalSearchParams();

  return (
    <View className="flex-1 p-4 bg-gray-700 items-center justify-start">
      <Text className="text-2xl font-bold text-white mt-4">{name}</Text>
    </View>
  );
}
