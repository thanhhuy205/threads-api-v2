"use client";

import { getPusherClient } from "@/lib/pusher/pusher";
import type Pusher from "pusher-js";
import React, { createContext, useContext, useMemo } from "react";

type RealtimeContextValue = {
    getClient: () => Promise<Pusher | null>;
};

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
    const value = useMemo(() => {
        return {
            getClient: getPusherClient,
        };
    }, []);
    return (
        <RealtimeContext.Provider value={value}>
            {children}
        </RealtimeContext.Provider>
    );
}

export function useRealtime() {
    const context = useContext(RealtimeContext);

    if (!context) {
        throw new Error("useRealtime must be used inside RealtimeProvider");
    }

    return context;
}
