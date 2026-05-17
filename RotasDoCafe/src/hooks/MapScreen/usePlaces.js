import { useEffect, useState } from 'react'
import getPlaces from '../../services/getPlaces'

export default function usePlaces() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true)
        const data = await getPlaces()
        setPlaces(data)
      } catch (error) {
        console.error('Error while fetching data: ', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaces()
  }, [])

  return { places, loading }
}
