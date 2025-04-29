import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

//find the next upcoming race
const getNextRace = (calendar) => {
  if (!calendar?.Races || calendar.Races.length === 0) {
    return null;
  }

  const today = new Date();

  //Filter only future races
  const upcomingRaces = calendar.Races.filter(
    (race) => new Date(`${race.date}T${race.time}`) > today
  );

  //Find the closest race
  return upcomingRaces.length > 0
    ? upcomingRaces.sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
      )[0]
    : null;
};

//RaceCountdown Component - Only Shows Next Race
const RaceCountdown = ({ calendar }) => {
  const nextRace = getNextRace(calendar);
  const [countdown, setCountdown] = useState("00:00:00");

  useEffect(() => {
    if (!nextRace) return;

    const updateCountdown = () => {
      const eventTime = new Date(`${nextRace.date}T${nextRace.time}`).getTime();
      const now = new Date().getTime();
      const timeDifference = eventTime - now;

      if (timeDifference <= 0) {
        setCountdown("Event is happening now!");
        return;
      }

      const hours = String(
        Math.floor(timeDifference / (1000 * 60 * 60))
      ).padStart(2, "0");
      const minutes = String(
        Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
      ).padStart(2, "0");
      const seconds = String(
        Math.floor((timeDifference % (1000 * 60)) / 1000)
      ).padStart(2, "0");

      setCountdown(`${hours}:${minutes}:${seconds}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextRace]);

  if (!nextRace) {
    return (
      <Text className="text-white text-lg font-semibold">
        No upcoming races found.
      </Text>
    );
  }

  return (
    <View className="p-6 rounded-xl bg-gray-700">
      <Text className="text-red-500 text-xl font-extrabold tracking-wide uppercase mb-3">
        Next Race: {nextRace.raceName}
      </Text>

      <Text className="text-gray-300 text-lg">
        Date: <Text className="text-white font-bold">{nextRace.date}</Text>
      </Text>
      <Text className="text-gray-300 text-lg">
        Time:{" "}
        <Text className="text-white font-bold">
          {new Date(`${nextRace.date}T${nextRace.time}`).toLocaleTimeString()}
        </Text>
      </Text>

      <View className="bg-black p-4 rounded-lg mt-4 border border-white shadow-lg">
        <Text className="text-white text-6xl font-extrabold tracking-widest">
          {countdown}
        </Text>
      </View>
    </View>
  );
};

export default RaceCountdown;
