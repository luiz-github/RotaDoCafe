import { useEffect, useState } from "react"
import getPlaces from "../../services/getPlaces"

export default function usePlaces() {
    const [places, setPlaces] = useState([])

    useEffect(() => {
        const fetchPlaces = async () => {
        try {
            const data = await getPlaces()
            setPlaces(data)
        } catch (error) {
            console.error("Error while fetching data: ", error)
        }
        };

        fetchPlaces()
    }, [])

    return places
}