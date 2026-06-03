import axios from "axios";

export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN!;
export const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID!;
export const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET!;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE!;

interface Auth0User {
  user_id: string;
  email: string;
  email_verified: boolean;
}

interface Auth0TokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

const AUTH0_ROLE_IDS: Record<"ADMIN" | "COMPANY" | "CANDIDATE", string> = {
  ADMIN: "rol_BlIKl2LW8soGcl40",
  COMPANY: "rol_9nLEkZFjOQTU72IN",
  CANDIDATE: "rol_R81zsOZuYYYuWB34",
};

export async function getManagementToken(): Promise<string> {
  const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
    client_id: process.env.AUTH0_M2M_CLIENT_ID,
    client_secret: process.env.AUTH0_M2M_CLIENT_SECRET,
    audience: process.env.AUTH0_MANAGEMENT_AUDIENCE,
    grant_type: "client_credentials",
  });

  return response.data.access_token;
}

export async function createAuth0User(
  email: string,
  password: string,
  role: string,
  managementToken: string,
): Promise<Auth0User> {
  const response = await axios.post(
    `https://${AUTH0_DOMAIN}/api/v2/users`,
    {
      email,
      password,
      connection: "Username-Password-Authentication",
      email_verified: false,
      app_metadata: { role },
      user_metadata: { role },
    },
    {
      headers: {
        Authorization: `Bearer ${managementToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
}

export async function assignAuth0RoleToUser(
  auth0UserId: string,
  role: "ADMIN" | "COMPANY" | "CANDIDATE",
  managementToken: string,
) {
  const roleId = AUTH0_ROLE_IDS[role];

  if (!roleId) {
    throw new Error(`Invalid role: ${role}`);
  }

  await axios.post(
    `https://${AUTH0_DOMAIN}/api/v2/users/${auth0UserId}/roles`,
    {
      roles: [roleId],
    },
    {
      headers: {
        Authorization: `Bearer ${managementToken}`,
        "Content-Type": "application/json",
      },
    },
  );
}

export async function authenticateWithAuth0(
  email: string,
  password: string,
): Promise<Auth0TokenResponse> {
  const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
    grant_type: "password",
    username: email,
    password: password,
    client_id: AUTH0_CLIENT_ID,
    client_secret: AUTH0_CLIENT_SECRET,
    audience: AUTH0_AUDIENCE,
    scope: "openid profile email offline_access",
    realm: "Username-Password-Authentication",
  });

  return response.data;
}
