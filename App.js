import { StatusBar } from 'expo-status-bar';
import {ScrollView, Dimensions, StyleSheet, Text, View, ActivityIndicator, SafeAreaView} from 'react-native';
import {useEffect, useState} from "react";
import * as Location from 'expo-location';
import Fontisto from '@expo/vector-icons/Fontisto';
import json from './data.json'
import {SafeAreaProvider} from "react-native-safe-area-context";

// 현재 디바이스의 크기를 가져온다.
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window")

// const API_KEY = '';
// const LANG = "kr";

const icons = {
  "Clouds": "cloudy",
  "Clear": "day-sunny",
  "Atmosphere": "cloudy-gusts",
  "Snow": "snowflake",
  "Rain": "rains",
  "Drizzle": "rain",
  "Thunderstorm": "lightning",
}



export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const [hourly, setHourly] = useState([])
  const getWeather = async () => {
    // 권한 체크하기
    const {granted} = await Location.requestForegroundPermissionsAsync();
    setOk(granted); // 위치정보 허용 여부 true / false

    const {coords: { latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync(
        {latitude, longitude}
    );

    setCity(location[0].city)

    // const API = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=${LANG}`
    // const response = await fetch(API);
    // console.log(response)
    // const json = await response.json();
    //
    // setDays(json.daily);
    setHourly(json.hourly);
  }

  useEffect(()=> {
    getWeather();
  }, [])

  const dateCnvt = function (time, format = "YYYY.MM.DD") {
    const nDate = new Date(Number(""+time+"000"))
    console.log(nDate)
    const year = nDate.getFullYear().toString().slice(-(/Y+/i.test(format) && format.match(/Y+/i)[0].length || 4));
    const month = (nDate.getMonth() + 1).toString().padStart(format.includes('MM') ? 2 : 1, '0');
    const day = nDate.getDate().toString().padStart(format.toUpperCase().includes('DD') ? 2 : 1, '0');

    const hour = nDate.getHours().toString().padStart(format.toUpperCase().includes('HH') ? 2 : 1, '0');
    const min = nDate.getMinutes().toString().padStart(format.includes('mm') ? 2 : 1, '0');
    const sec = nDate.getSeconds().toString().padStart(format.toUpperCase().includes('SS') ? 2 : 1, '0');

    return format.replace(/Y{1,4}/i, year)
          .replace(/MM?/, month)
          .replace(/DD?/i, day)
          .replace(/HH?/i, hour)
          .replace(/mm?/, min)
          .replace(/ss?/i, sec)

  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="black" />
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
        </View>
        <View style={{flex: 1.2}}>
          <ScrollView
              pagingEnabled // 자유롭지 않은 스크롤을 위해
              horizontal    // 가로모드
              showsHorizontalScrollIndicator={false} // 스크롤바 숨김처리
          >
            {days.length === 0 ? (
                <View style={{...styles.day, alignItems: "center"}}>
                  <ActivityIndicator color="white" style={{marginTop : 10}}  size="large"/>
                </View>
                ) : (
                    days.map((day, index) =>
                        <View key={index} style={styles.day}>
                          <View style={{flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between"}}>
                            <View>
                              <Text style={styles.date}>{dateCnvt(day.dt, "YYYY.MM.DD")}</Text>
                              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                            </View>
                            <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
                          </View>
                          <Text style={styles.description}>{day.weather[0].main}</Text>
                          <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                        </View>
                    )
            )}
          </ScrollView>
        </View>
        <View style={{flex: 2}}>
          <ScrollView>
            {hourly.length === 0 ? (
                <View style={{...styles.day, alignItems: "center"}}>
                  <ActivityIndicator color="white" style={{marginTop : 10}}  size="large"/>
                </View>
            ) : (
                hourly.map((hour, index) =>
                    <View key={index} style={styles.hour}>
                      <View style={{flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between"}}>
                        <View>
                          <Text style={{...styles.date, fontSize: 20}}>{dateCnvt(hour.dt, "DD일 hh시")}</Text>
                          <Text style={{...styles.temp, fontSize: 36}}>{parseFloat(hour.temp).toFixed(1)}</Text>
                          <Text style={{...styles.tinyText}}>{hour.weather[0].description}</Text>
                        </View>
                        <Fontisto name={icons[hour.weather[0].main]} size={68} color="white" />
                      </View>
                    </View>
                )
            )}
          </ScrollView>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "teal",
  },
  city: {
    flex: 0.5,
    backgroundColor: "teal",
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    fontSize: 60,
    fontWeight: "500",
    color: "white",
    marginTop: 20
  },
  hour: {
    height: 100,
    alignItems: "flex-start",
    padding: 20,
    marginTop: 10
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    padding: 20,
  },
  date: {
    fontSize: 20,
    color: "white"
  },
  temp: {
    fontSize: 138,
    fontWeight: "500",
    color: "white"
  },
  description: {
    fontSize: 60,
    marginTop: -30,
    color: "white"
  },
  tinyText: {
    fontSize: 20,
    color: "white"
  }
})
