import { View, Text } from "react-native";
import DriversList from "./components/DriversList";

export default function App() {
  return (
    <View className="flex-1 items-center bg-gray-700">
      <Text className="text-red-500 text-2xl font-bold pt-3 pb-1">FORMULA 1</Text>
      <DriversList />
    </View>
  );
}