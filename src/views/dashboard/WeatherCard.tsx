'use client'

import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const API_KEY = 'YOUR_API_KEY' // 실제 배포 시 환경변수로 관리
const CITY = 'Seoul'

const WeatherCard = () => {
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=kr`
        )

        const data = await res.json()

        setWeather(data)
      } catch (e) {
        setWeather(null)
      }

      setLoading(false)
    }

    fetchWeather()
  }, [])

  return (
    <Card
      sx={{
        background: 'rgba(255,255,255,0.22)',
        backdropFilter: 'blur(18px)',
        borderRadius: 4,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        border: '1.5px solid rgba(255,255,255,0.25)',
        minHeight: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        {loading ? (
          <Typography>날씨 정보를 불러오는 중...</Typography>
        ) : weather && weather.weather ? (
          <Box display='flex' flexDirection='column' alignItems='center'>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              style={{ width: 64, height: 64 }}
            />
            <Typography variant='h5' fontWeight={700}>
              {Math.round(weather.main.temp)}°C
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              {weather.weather[0].description}
            </Typography>
          </Box>
        ) : (
          <Typography color='error'>날씨 정보를 불러올 수 없습니다.</Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default WeatherCard
