import {
    handleLoginRedirect,
    handleLoginCallback,
    isAuthenticated as checkAuth,
    logout as keycloakLogout,
    getUser
} from './KeycloakService';

export const loginApi = async (username: string, password: string) => {
    // With Keycloak OIDC, login is handled via redirect, not direct API call.
    // This function is kept for compatibility but redirects to Keycloak.
    await handleLoginRedirect();
};

export const handleKeycloakCallback = async () => {
    return await handleLoginCallback();
};

export const isTokenExpired = async (): Promise<boolean> => {
    return !(await checkAuth());
};

export const logout = async () => {
    await keycloakLogout();
};

export const getCurrentUser = async () => {
    return await getUser();
};
