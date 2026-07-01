import { UserManager, User } from 'oidc-client-ts';

const oidcConfig = {
  authority: "https://172.29.11.201:8086/realms/Invoicing%20System",
  client_id: "invoicingsystemclient",
  redirect_uri: window.location.origin + "/login",
  post_logout_redirect_uri: window.location.origin + "/login",
  response_type: "code",
  scope: "openid profile email",
  automaticSilentRenew: true,
  includeIdTokenInSilentRenew: true,
};

let userManager: UserManager | null = null;

export const getKeycloakService = (): UserManager => {
  if (!userManager) {
    userManager = new UserManager(oidcConfig);
  }
  return userManager;
};

export const handleLoginRedirect = async (): Promise<void> => {
  const mgr = getKeycloakService();
  try {
    const user = await mgr.getUser();
    if (user && !user.expired) {
      return;
    }
  } catch {
    // ignore
  }
  await mgr.signinRedirect();
};

export const handleLoginCallback = async (): Promise<User | null> => {
  const mgr = getKeycloakService();
  try {
    const user = await mgr.signinRedirectCallback();
    return user;
  } catch {
    return null;
  }
};

export const getToken = async (): Promise<string | null> => {
  const mgr = getKeycloakService();
  try {
    const user = await mgr.getUser();
    if (user && !user.expired) {
      return user.access_token;
    }
  } catch {
    // ignore
  }
  return null;
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getToken();
  console.log("isAuthenticated: token", token);
  return token !== null;
};

export const logout = async (): Promise<void> => {
  const mgr = getKeycloakService();
  await mgr.signoutRedirect();
};

export const getUser = async (): Promise<User | null> => {
  const mgr = getKeycloakService();
  try {
    const user = await mgr.getUser();
    if (user && !user.expired) {
      return user;
    }
  } catch {
    // ignore
  }
  return null;
};
