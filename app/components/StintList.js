import React from "react";
import { View, Text } from "react-native";

const StintList = ({ stints }) => {
  if (!stints || stints.length === 0) return null;

  return (
    <View>
      {stints.map((stint, index) => (
        <Text key={index} className="text-white">
          Stint #{stint.stint_number}: Lap {stint.lap_start}-{stint.lap_end} (
          {stint.compound} Tyre)
        </Text>
      ))}
    </View>
  );
};

export default StintList;
