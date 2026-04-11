import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function useGallery() {
    const [ status, setStatus ] = useState(null)
    const [canAskAgain, setCanAskAgain] = useState(true)

    const requestGalleryPermission = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        setStatus(permission.status)
        setCanAskAgain(permission.canAskAgain)

        return permission
    }

    useEffect(() => {
        requestGalleryPermission()
    },[])

    return { status, canAskAgain, requestGalleryPermission }
};