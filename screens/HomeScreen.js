import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  CalendarDaysIcon,
  MagnifyingGlassCircleIcon,
} from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";
import { weatherImages } from "../constants";
import * as Progress from 'react-native-progress';

const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const handleLocation = (loc) => {
    console.log("location: ", loc);
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      2;
      setWeather(data);
      setLoading(false);
      console.log("got forecast: ", data);
    });
  };

  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        setLocations(data);
      });
    }
  };
  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    fetchWeatherForecast({
      cityName: "Astana",
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const { current, location } = weather;

  return (
    <View style={styles.homeScreen}>
      <StatusBar style="light" />
      <Image
        blurRadius={70}
        style={styles.imageMain}
        source={require("../assets/bg.png")}
      />
      {loading ? (
        <View
          style={{
            flex: "1",
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
        </View>
      ) : (
        <SafeAreaView style={styles.safeAreaView}>
          <View style={styles.search}>
            <View
              style={[
                styles.mainInput,
                {
                  backgroundColor: showSearch
                    ? "rgba(255,255,255, 0.2)"
                    : "transparent",
                  borderRadius: 999,
                },
              ]}
            >
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  style={[styles.textInput]}
                  placeholder="Searce sity"
                  placeholderTextColor="lightgray"
                  color="white"
                />
              ) : null}

              <TouchableOpacity
                style={styles.btnSearch}
                onPress={() => toggleSearch(!showSearch)}
              >
                <MagnifyingGlassCircleIcon
                  size="40"
                  color="rgba(255,255,255, 0.6)"
                />
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearch ? (
              <View style={styles.cityName}>
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                      key={index}
                      style={[
                        styles.searchCity,
                        showBorder ? { borderBottomWidth: 1 } : "",
                      ]}
                    >
                      <MapPinIcon size={20} color="gray" />
                      <Text style={{ paddingVertical: 10 }}>
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          <View style={styles.forecastSection}>
            <Text style={styles.location}>
              {location?.name}, {""}
              <Text style={styles.country}>{location?.country}</Text>
            </Text>
            <View style={{ width: "100%", alignItems: "center" }}>
              <Image
                source={weatherImages[current?.condition?.text]}
                style={{ width: 200, height: 200 }}
              />
            </View>
            <View style={styles.degreeCelcius}>
              <Text style={styles.celcius}>{current?.temp_c}&#176;</Text>
              <Text style={styles.celciusText}>{current?.condition?.text}</Text>
            </View>
            <View style={styles.otherStats}>
              <View style={styles.otherContent}>
                <Image
                  source={require("../assets/wind.png")}
                  style={styles.wind}
                />
                <Text style={{ color: "white" }}>{current?.wind_kph}km</Text>
              </View>
              <View style={styles.otherContent}>
                <Image
                  source={require("../assets/drop.png")}
                  style={styles.wind}
                />
                <Text style={{ color: "white" }}>{current?.humidity}%</Text>
              </View>
              <View style={styles.otherContent}>
                <Image
                  source={require("../assets/sun.png")}
                  style={styles.wind}
                />
                <Text style={{ color: "white" }}>6:05 AM</Text>
              </View>
            </View>
          </View>
          <View
            style={{ justifyContent: "space-evenly", height: "25%", gap: 10 }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 15,
              }}
            >
              <CalendarDaysIcon size="26" color={"white"} />
              <Text
                style={{
                  color: "white",
                  fontWeight: "base",
                  fontSize: 16,
                  paddingHorizontal: 10,
                }}
              >
                Daily forexast
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {weather?.forecast?.forecastday?.map((item, index) => {
                let date = new Date(item.date);
                let optoins = { weekday: "long" };
                let dayName = date.toLocaleDateString("en-US", optoins);
                dayName = dayName.split(",")[0];
                return (
                  <View style={styles.nextDay} key={index}>
                    <Image
                      source={weatherImages[item?.day?.condition?.text]}
                      style={{ height: 60, width: 60 }}
                    />
                    <Text style={{ color: "white", fontSize: 16 }}>
                      {item.date}
                    </Text>
                    <Text
                      style={{ color: "white", fontSize: 20, fontWeight: 700 }}
                    >
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  homeScreen: {
    position: "relative",
    width: "100%",
    height: "100%",
  },

  main: {
    backgroundColor: "light",
  },
  imageMain: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  search: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 14,
    zIndex: 50,
    paddingTop: 30,
  },
  mainInput: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  textInput: {
    width: "82%",
    fontSize: 18,
  },
  btnSearch: {
    borderRadius: 999,
    padding: 3,
    margin: 1,
    backgroundColor: "rgba(255,255,255, 0.2)",
  },
  cityName: {
    width: "100%",
    backgroundColor: "rgba(255,255,255, 1)",
    top: 3,
    borderRadius: 20,
    zIndex: 10,
  },
  searchCity: {
    flexDirection: "row",
    alignItems: "center",
    padding: 3,
    paddingHorizontal: 4,
    marginBottom: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  forecastSection: {
    marginHorizontal: 4,
    justifyContent: "space-between",
    // alignItems: "center",
    marginTop: 40,
    paddingVertical: 30,
    height: "70%",
  },
  location: {
    color: "white",
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
  },
  country: {
    fontWeight: "semibold",
    fontSize: 22,
    color: "rgba(255,255,255, 0.6)",
  },
  degreeCelcius: {},
  celcius: {
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    fontSize: 50,
  },
  celciusText: {
    color: "rgba(255,255,255, 0.6)",
    textAlign: "center",
    fontSize: 20,
  },
  wind: {
    height: 26,
    width: 26,
  },
  otherStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  otherContent: {
    gap: 7,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  nextDay: {
    width: 120,
    height: 150,
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255, 0.15)",
    marginHorizontal: 10,
  },
  safeAreaView: {
    height: "100%",
    margin: 0,
    padding: 0,
  },
});
