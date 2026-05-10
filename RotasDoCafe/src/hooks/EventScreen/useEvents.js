import { useEffect, useState } from "react";
import {
    getEvents,
    createEvent,
    deleteEvent,
    updateEvent
} from "../../services/events/eventService";

import Toast from "react-native-toast-message";

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await getEvents();
            setEvents(data);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);

            Toast.show({
                type: "error",
                text1: "Erro ao carregar eventos",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (eventData) => {
        try {
            await createEvent(eventData);

            Toast.show({
                type: "success",
                text1: "Evento criado!",
            });

            await fetchEvents();
            return true;

        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Erro ao criar evento",
            });

            return false;
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await deleteEvent(eventId)

            Toast.show({
                type: "success",
                text1: "Evento deletado!",
            });

            await fetchEvents();
            return true;

        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Erro ao deletar",
            });

            return false;
        }
    };

    const handleUpdateEvent = async (eventId, updatedData) => {
        try {
            await updateEvent(eventId, updatedData);

            Toast.show({
                type: "success",
                text1: "Evento atualizado!",
            });

            await fetchEvents();
            return true;

        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Erro ao atualizar",
            });

            return false;
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return {
        events,
        loading,
        fetchEvents,
        createEvent: handleCreateEvent,
        deleteEvent: handleDeleteEvent,
        updateEvent: handleUpdateEvent,
    };
};