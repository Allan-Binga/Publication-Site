import { useToast } from "../components/ToastContext";
import Toast from "./Toast";

function ToastContainer() {
    const { toasts } = useToast();

    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} />
            ))}
        </div>
    );
}

export default ToastContainer;