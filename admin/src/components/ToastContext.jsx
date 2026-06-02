import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = ({
        type = "info",
        title,
        message,
        duration = 4000,
    }) => {
        const id = crypto.randomUUID();

        const toast = {
            id,
            type,
            title,
            message,
        };

        setToasts((prev) => [...prev, toast]);

        if (type !== "loading") {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    };

    const updateToast = (id, updates) => {
        setToasts((prev) =>
            prev.map((toast) =>
                toast.id === id
                    ? { ...toast, ...updates }
                    : toast
            )
        );

        if (updates.type !== "loading") {
            setTimeout(() => {
                removeToast(id);
            }, 3000);
        }
    };

    const removeToast = (id) => {
        setToasts((prev) =>
            prev.filter((toast) => toast.id !== id)
        );
    };

    return (
        <ToastContext.Provider
            value={{
                showToast,
                updateToast,
                removeToast,
                toasts,
            }}
        >
            {children}
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);