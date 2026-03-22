import * as Location from 'expo-location'
import { useState, useEffect } from 'react'

export default function useLocation() {
  const [location, setLocation] = useState(null)
  const [status, setStatus] = useState(null)
  const [canAskAgain, setCanAskAgain] = useState(true)

  const requestPermission = async () => {
    const permission = await Location.requestForegroundPermissionsAsync()

    setStatus(permission.status)
    setCanAskAgain(permission.canAskAgain)

    if (permission.status !== 'granted') return

    const { coords } = await Location.getCurrentPositionAsync({})
    setLocation(coords)
  }

  useEffect(() => {
    requestPermission()
  }, [])

  return { location, status, canAskAgain, requestPermission }
}
