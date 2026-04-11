import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function useCamera() {
    const [ status, setStatus ] = useState(null)
    const [canAskAgain, setCanAskAgain] = useState(true)

    const requestCameraPermission = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
    
        setStatus(permission.status)
        setCanAskAgain(permission.canAskAgain)

        return permission
    }

    useEffect(() => {
        requestCameraPermission()
    },[])

    return { status, canAskAgain, requestCameraPermission }
};