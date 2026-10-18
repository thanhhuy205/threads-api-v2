"use client";
import { initKeycloak } from "@/lib/keycloak";
import Keycloak from "keycloak-js";
import React, { createContext, useContext, useEffect, useState } from "react";

type KeycloakContextValue = { client: Keycloak | null; error: string | null };

const KeycloakContext = createContext<KeycloakContextValue | null>(null);

export function KeycloakProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<Keycloak | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void initKeycloak()
      .then((value) => {
        if (active) setClient(value);
      })
      .catch((cause: unknown) => {
        if (active)
          setError(
            cause instanceof Error ? cause.message : "Login setup failed",
          );
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <KeycloakContext.Provider value={{ client, error }}>
      {children}
    </KeycloakContext.Provider>
  );
}

export function useKeycloak() {
  const context = useContext(KeycloakContext);

  if (!context) {
    throw new Error("useKeycloak must be used inside KeycloakProvider");
  }

  return context;
}
