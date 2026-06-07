import * as Location from 'expo-location'
import { useState, useEffect } from 'react'

export default function useLocation() {
  const [location, setLocation] = useState(null)
  const [status, setStatus] = useState(null)
  const [canAskAgain, setCanAskAgain] = useState(true)

const requestPermission = async () => {
  try {
    const permission = await Location.requestForegroundPermissionsAsync()

    setStatus(permission.status)
    setCanAskAgain(permission.canAskAgain)

    if (permission.status !== 'granted') {
      return
    }

    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    })

    setLocation(currentLocation.coords)
  } catch (error) {
    console.error('LOCATION ERROR:', error)
  }
}
  useEffect(() => {
    requestPermission()
  }, [])

  return { location, status, canAskAgain, requestPermission }
}
