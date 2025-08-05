import { AccountInfo, EventType, PublicClientApplication } from "@azure/msal-browser";
import { checkLoggedIn, msalConfig, useLogin } from "./authConfig";
import { useEffect, useState } from "react";
import { MsalProvider } from "@azure/msal-react";
import { LoginContext } from "./loginContext";
import Layout from "./pages/layout/Layout";

const LayoutWrapper = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (useLogin) {
            const initializeMsal = async () => {
                const instance = new PublicClientApplication(msalConfig);

                // Initialize MSAL instance
                await instance.initialize();

                // Default to using the first account if no account is active on page load
                if (!instance.getActiveAccount() && instance.getAllAccounts().length > 0) {
                    // Account selection logic is app dependent. Adjust as needed for different use cases.
                    instance.setActiveAccount(instance.getAllAccounts()[0]);
                }

                // Listen for sign-in event and set active account
                instance.addEventCallback(event => {
                    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
                        const account = event.payload as AccountInfo;
                        instance.setActiveAccount(account);
                    }
                });

                setMsalInstance(instance);
                setIsInitialized(true);

                // Check login status after initialization
                const loginStatus = await checkLoggedIn(instance);
                setLoggedIn(loginStatus);
            };

            initializeMsal().catch(console.error);
        } else {
            setIsInitialized(true);
        }
    }, []);

    // Show loading state while MSAL is initializing
    if (useLogin && !isInitialized) {
        return <div>Loading...</div>;
    }

    if (useLogin && msalInstance) {
        return (
            <MsalProvider instance={msalInstance}>
                <LoginContext.Provider
                    value={{
                        loggedIn,
                        setLoggedIn
                    }}
                >
                    <Layout />
                </LoginContext.Provider>
            </MsalProvider>
        );
    } else {
        return (
            <LoginContext.Provider
                value={{
                    loggedIn,
                    setLoggedIn
                }}
            >
                <Layout />
            </LoginContext.Provider>
        );
    }
};

export default LayoutWrapper;
