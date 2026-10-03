"use client";

import type PusherJS from "pusher-js";
import { configService } from "@/config";

let pusherClient: PusherJS | null = null;

export async function getPusherClient() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!pusherClient) {
    const soketiKey = configService.soketiKey;
    const soketiHost = configService.soketiHost;

    const { default: PusherConstructor } = await import("pusher-js");
    const useTLS = window.location.protocol === "https:";

    PusherConstructor.logToConsole = configService.isDev;

    pusherClient = new PusherConstructor(soketiKey, {
      wsHost: soketiHost,
      wsPort: configService.soketiPort,
      wssPort: configService.soketiPort,

      forceTLS: useTLS,
      enabledTransports: ["ws"],
      enableStats: false,

      channelAuthorization: {
        endpoint: "/api/pusher/auth",
        transport: "ajax",
      },

      cluster: "",
    });
  }

  return pusherClient;
}

export function disconnectPusherClient() {
  pusherClient?.disconnect();
  pusherClient = null;
}
