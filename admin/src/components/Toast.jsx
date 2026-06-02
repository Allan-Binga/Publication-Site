import {
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Info,
} from "lucide-react";

import Spinner from "./Spinner";

function Toast({ toast }) {
    const styles = {
        success: {
            border: "bg-emerald-700",
            icon: (
                <CheckCircle2
                    className="w-5 h-5 text-emerald-700"
                />
            ),
        },

        error: {
            border: "bg-red-600",
            icon: (
                <XCircle
                    className="w-5 h-5 text-red-600"
                />
            ),
        },

        warning: {
            border: "bg-amber-500",
            icon: (
                <AlertTriangle
                    className="w-5 h-5 text-amber-500"
                />
            ),
        },

        info: {
            border: "bg-slate-500",
            icon: (
                <Info
                    className="w-5 h-5 text-slate-500"
                />
            ),
        },

        loading: {
            border: "bg-emerald-800",
            icon: <Spinner color="border-emerald-700" />,
        },
    };

    const current =
        styles[toast.type] || styles.info;

    return (
        <div
            className="
            relative
            overflow-hidden
            w-[360px]
            bg-white
            border
            border-slate-200
            rounded-lg
            shadow-lg
            animate-[slideIn_0.25s_ease-out]
        "
        >
            <div
                className={`absolute left-0 top-0 h-full w-1 ${current.border}`}
            />

            <div className="flex gap-3 p-4 pl-5">
                <div className="mt-0.5">
                    {current.icon}
                </div>

                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-900">
                        {toast.title}
                    </h3>

                    {toast.message && (
                        <p className="text-xs text-slate-500 mt-1">
                            {toast.message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Toast;