import { useEffect, useState } from "react";
import {
    getEvents,
    createEvent,
    deleteEvent,
    updateEvent
} from "../../services/events/eventService";
import useToast from "../../components/Toast/ToastMessage";

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useToast()

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await getEvents();
            setEvents(data);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);

            showError("Erro ao carregar eventos");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (eventData) => {
        try {
            await createEvent(eventData);

            showSuccess("Evento criado!");

            await fetchEvents();
            return true;

        } catch (error) {
            showError("Erro ao criar evento");
            return false;
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await deleteEvent(eventId)

            showSuccess("Evento deletado!");

            await fetchEvents();
            return true;

        } catch (error) {
            showError("Erro ao deletar evento");

            return false;
        }
    };

    const handleUpdateEvent = async (eventId, updatedData) => {
        try {
            await updateEvent(eventId, updatedData);

            showSuccess("Evento atualizado!");

            await fetchEvents();
            return true;

        } catch (error) {
            showError("Erro ao atualizar evento");
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