import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getWeatherByCurrentIP, WeatherResponse  } from '../services/weatherService';
import LottieView from 'lottie-react-native';

export default function WeatherScreen() {
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

        useEffect(() => {
            const loadWeather = async () => {
            try {
                const data = await getWeatherByCurrentIP();
                setWeather(data);
            } catch (err) {
                console.error('Error:', err);
                setError('Error: unable to load weather');
            } finally {
                setLoading(false);
            }
            };

            loadWeather();
        }, []);

    const getWeatherLottie = (code: number) => {
        switch (code) {
            case 0:
                return require('../../assets/Weather-sunny.json');
            case 1:
            case 2:
            case 3:
                return require('../../assets/Weather-partly cloudy.json');
            case 45:
            case 48:
                return require('../../assets/Weather-windy.json');
            case 51:
            case 61:
                return require('../../assets/Weather-partly shower.json');
            case 95:
            case 96:
                return require('../../assets/Weather-storm.json');
            default:
                return require('../../assets/Weather-sunny.json');
            
        }
    }

    if (loading) {
        return (
        <View style={styles.center}>
            <LottieView source={require('../../assets/loader.json')} autoPlay loop style={styles.loadingLottie}/>
        </View>
        );
    }

    if (error) {
        return (
        <View style={styles.center}>
            <LottieView source={require('../../assets/cloud-error.json')} autoPlay loop style={styles.lottie}/>
            <Text>{error}</Text>
        </View>
        );
    }

    const animation = getWeatherLottie(weather?.weatherCode ?? 0);
    return (
        <View style={[styles.center, {backgroundColor: weather?.isDay ? '#F0F8FF' : '#2A2830'}]}>
            <LottieView source={animation} autoPlay loop style={styles.lottie}/>
            <Text style={{fontWeight: 700, fontSize: 20, color: weather?.isDay ? '#121212' : '#F0F8FF'}}>{weather?.tempMin.toFixed(1)}ºC / {weather?.tempMax.toFixed(1)}ºC</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 8
    },
    lottie: {
        width: 250,
        height: 250
    },
    loadingLottie: {
        width: 150,
        height: 150
    }
});