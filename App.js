import React, { useEffect, useState } from "react"
import * as Location from 'expo-location';
import { View, StyleSheet, Text, ScrollView,Dimensions, ActivityIndicator } from 'react-native';

const {width:SCREEN_WIDTH} = Dimensions.get("window")

export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const API_KEY = "903d5086ce432391f1c163077ba817a2";

  const getWeather = async () => {
    const { permission:granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    Location.setGoogleApiKey("AIzaSyDts0opcwiyKdRs_9zVgFwd78knK8a9aQI");
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false })
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=ALERTS&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        {days.length === 0 ?
          <View style={styles.day}>
            <ActivityIndicator color="black" size="large" style={{ marginTop: 10 }}></ActivityIndicator>
          </View> :
          days.map((day, index) =>
            <View style={styles.day}>
              <Text style={styles.date}>{new Date(day.dt*1000).toString().substring(0,10)}</Text>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>)
        }
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1AF14",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems:"center"
  },
  date: {
    fontSize: 20
  },
  temp: {
    fontSize: 178,
    fontWeight: "600"
  },
  description: {
    marginTop: -30,
    fontSize: 58,
    fontWeight: "500"
  },
  tinyText: {
    fontSize:20
  }
})