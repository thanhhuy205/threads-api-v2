import Keycloak from "keycloak-js"; // Import the Keycloak type.

let initPromise: Promise<Keycloak> | null = null; // Save the first initialization task.

export function initKeycloak(): Promise<Keycloak> { // Start Keycloak safely.
    if (initPromise) return initPromise; // Avoid starting Keycloak twice.

    initPromise = (async () => { // Begin browser initialization.

        const client = new Keycloak({
            url: process.env.NEXT_PUBLIC_KEYCLOAK_URL!, // Set the Keycloak URL.
            realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM!, // Set the realm.
            clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!, // Set the client ID.
        }); // Finish client configuration.

        await client.init({ // Check the existing login.
            onLoad: "login-requiredt", // Check login without forcing it.
            pkceMethod: "S256", // Protect the authorization code.
            checkLoginIframe: false, // Disable the session iframe.
        }); // Finish initialization.

        return client; // Return the ready client.
    })().catch((error: unknown) => { // Handle initialization errors.
        initPromise = null; // Allow another attempt.
        throw error; // Send the error to the caller.
    }); // Finish the initialization task.

    return initPromise; // Share the task across components.
} // Finish the function.