import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import StintList from "./StintList";

const DriverItem = ({ driver, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        className={`flex-row items-center p-4 my-2 rounded-lg`}
        style={{ backgroundColor: `#${driver.team_colour}99` }}
      >
        <View className="flex-shrink-0">
          <Text className="text-white text-4xl font-bold">
            {driver.position}
          </Text>
        </View>
        <Image
          source={{ uri: driver.headshot_url }}
          className="w-16 h-16 rounded-full mr-4"
        />
        <View>
          <Text className="text-lg font-bold mt-0">{driver.full_name}</Text>
          <Text className="text-grey-700">{driver.team_name}</Text>
          <StintList stints={driver.stints} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DriverItem;
