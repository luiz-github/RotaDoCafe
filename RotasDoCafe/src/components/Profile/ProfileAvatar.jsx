import { View, Image, Pressable, Text, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState, useRef } from "react";
import { Animated } from "react-native";

export default function ProfileAvatar() {
    const [image, setImage] = useState(null);
    const [base64Image, setBase64Image] = useState(null);
    const [visible, setVisible] = useState(false);

    const slideAnim = useRef(new Animated.Value(300)).current;

    const openModal = () => {
        setVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(slideAnim, {
            toValue: 300,
            duration: 200,
            useNativeDriver: true,
        }).start(() => setVisible(false));
    };

    const openCamera = async () => {
        closeModal();

        try {
            const permission = await ImagePicker.requestCameraPermissionsAsync();

            if (!permission.granted) {
                alert("Permissão da câmera necessária");
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                quality: 0.7,
                base64: true,
            });

            if (!result.canceled && result.assets?.length > 0) {
                const asset = result.assets[0];

                setImage(asset.uri);
                setBase64Image(asset.base64);

                console.log("BASE64:", asset.base64);
            }
        } catch (error) {
            console.log("Erro ao abrir câmera:", error);
        }
    };

    const openGallery = async () => {
        closeModal();

        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                alert("Permissão da galeria necessária");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
                base64: true,
            });

            if (!result.canceled && result.assets?.length > 0) {
                const asset = result.assets[0];

                setImage(asset.uri);
                setBase64Image(asset.base64);

                console.log("BASE64:", asset.base64);
            }
        } catch (error) {
            console.log("Erro ao abrir galeria:", error);
        }
    };

    const removeImage = () => {
        closeModal();
        setImage(null);
        setBase64Image(null);
    };

    return (
        <View className="items-center gap-3">

            <Pressable onPress={openModal}>
                <Image
                    source={
                        image
                            ? { uri: image }
                            : require("../../../assets/profile/profile-without-photo.jpg")
                    }
                    className="w-28 h-28 rounded-full"
                />
            </Pressable>

            <Text className="text-sm text-gray-400">
                Toque para alterar foto
            </Text>

            <Modal transparent visible={visible} animationType="none">

                <Pressable
                    onPress={closeModal}
                    className="flex-1 bg-black/50 justify-end"
                >

                    <Animated.View
                        style={{ transform: [{ translateY: slideAnim }] }}
                        className="bg-white rounded-t-3xl p-5"
                    >

                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-lg font-bold text-gray-500">
                                Escolher foto
                            </Text>

                            <Pressable onPress={closeModal}>
                                <Text className="text-xl">✕</Text>
                            </Pressable>
                        </View>

                        <Pressable
                            onPress={openCamera}
                            className="flex-row items-center py-4 border-b border-gray-200 active:bg-gray-100"
                        >
                            <Text className="text-orange-500 text-lg mr-3">📸</Text>

                            <Text className="flex-1 text-base font-semibold">
                                Tirar foto
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={openGallery}
                            className="flex-row items-center py-4 active:bg-gray-100"
                        >
                            <Text className="text-orange-500 text-lg mr-3">🖼️</Text>

                            <Text className="flex-1 text-base font-semibold">
                                Escolher da galeria
                            </Text>
                        </Pressable>

                        {image && (
                            <Pressable
                                onPress={removeImage}
                                className="flex-row items-center py-4 border-t border-gray-200 active:bg-red-50"
                            >
                                <Text className="text-red-500 text-lg mr-3">🗑️</Text>

                                <Text className="flex-1 text-base font-semibold text-red-500">
                                    Remover foto
                                </Text>
                            </Pressable>
                        )}

                    </Animated.View>

                </Pressable>

            </Modal>

        </View>
    );
}