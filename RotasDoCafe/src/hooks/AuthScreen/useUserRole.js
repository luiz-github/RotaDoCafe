import { use, useEffect, useState } from "react";
import {doc, getDoc} from "firebase/firestore";
import { db, auth } from "../../services/firebase";

export const useUserRole = () => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const snap = await getDoc(doc(db, 'users', user.uid));

                if (snap.exists()) {
                    setRole(snap.data().role);
                }

            } catch (error) {
                console.error("Erro ao buscar role do usuário:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRole();
    }, []);

    return { role, loading };
};