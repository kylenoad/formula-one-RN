import { View, Text } from "react-native";
import DriversList from "./components/DriversList"

export default function App() {
  return (
    <View className="flex-1 items-center bg-gray-700">
      <Text className="text-red-500 text-2xl font-bold">FORMULA 1</Text>
      <DriversList />
    </View>
  );
}
