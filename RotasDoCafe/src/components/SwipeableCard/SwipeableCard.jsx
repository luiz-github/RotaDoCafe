import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { View, Text, TouchableOpacity } from "react-native";
import { formatDateTime } from "../../utils/date";
import { useState } from "react";

export default function SwipeableCard({ events = [], loading, deleteEvent, fetchEvents, navigation }) {
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const renderRightActions = (event) => {
        const isConfirming = confirmDeleteId === event.id;
        return (
            <View className="flex-row mb-4 overflow-hidden rounded-r-xl" style={{ width: 192, marginLeft: -12 }}>
                <TouchableOpacity
                    onPress={() => {
                        if (isConfirming) {
                            setConfirmDeleteId(null);
                        } else {
                            navigation.navigate("EditEvent", { event });
                        }
                    }}
                    style={{ width: 96 }}
                    className={`justify-center items-center ${isConfirming ? "bg-gray-500" : "bg-blue-500"}`}
                >
                    <Text className="text-white text-center text-xs">
                        {isConfirming ? "Cancelar" : "Editar"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={async () => {
                        if (!isConfirming) {
                            setConfirmDeleteId(event.id);
                            setTimeout(() => setConfirmDeleteId(null), 5000);
                            return;
                        }
                        const success = await deleteEvent(event.id);
                        if (success) fetchEvents();
                        setConfirmDeleteId(null);
                    }}
                    style={{ width: 96 }}
                    className={`justify-center items-center ${isConfirming ? "bg-red-700" : "bg-red-500"}`}
                >
                    <Text className="text-white text-center text-xs">
                        {isConfirming ? "Confirmar" : "Deletar"}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <View>
            {loading && <Text className="text-gray-400">Carregando...</Text>}
            {!loading && events.map((event) => {
                const { date, time } = formatDateTime(event.date);
                return (
                    <Swipeable
                        key={event.id}
                        renderRightActions={() => renderRightActions(event)}
                        overshootRight={false}
                        friction={2}
                        rightThreshold={40}
                    >
                        <View
                            className="bg-coffeeLight p-4 rounded-xl mb-4"
                            style={{ zIndex: 10, elevation: 5 }}
                        >
                            <Text className="text-white font-semibold text-lg">{event.title}</Text>
                            <Text className="text-gray-400 text-sm">
                                📍 {event.city} • {date} às {time}
                            </Text>
                        </View>
                    </Swipeable>
                );
            })}
        </View>
    );
}