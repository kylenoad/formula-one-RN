import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import DriversList from "./components/DriversList";
import RaceCountdown from "./components/RaceCountdown";
import { useCalendarData } from "./components/hooks/useCalendarData";

export default function App() {
  const { calendar, error } = useCalendarData();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar style="light" backgroundColor="#000000" />
      <View className="flex-1 items-center bg-gray-800">
        <Text className="text-red-500 text-2xl font-bold pt-3 pb-1">
          FORMULA 1 BUDDY
        </Text>
        <RaceCountdown calendar={calendar} error={error} />
        <Text className="text-white text-1xl pt-6">
          Select a driver for more information
        </Text>
        <DriversList />
      </View>
    </SafeAreaView>
  );
}
