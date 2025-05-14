'use client'

import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const TimeCard = () => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)

    return () => clearInterval(timer)
  }, [])

  const pad = (n: number) => n.toString().padStart(2, '0')
  const hours = pad(now.getHours())
  const minutes = pad(now.getMinutes())
  const seconds = pad(now.getSeconds())
  const dateStr = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

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
        <Box display='flex' flexDirection='column' alignItems='center'>
          <Typography variant='h5' fontWeight={700} sx={{ fontSize: 36 }}>
            {hours}:{minutes}:{seconds}
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ mt: 1 }}>
            {dateStr}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default TimeCard
