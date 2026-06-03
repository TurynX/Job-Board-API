import axios from "axios";
import {
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
} from "./auth0Management";

export async function logoutService(refreshToken: string) {
  await axios.post(`https://${AUTH0_DOMAIN}/oauth/revoke`, {
    client_id: AUTH0_CLIENT_ID,
    client_secret: AUTH0_CLIENT_SECRET,
    token: refreshToken,
  });

  return { message: "Logged out successfully" };
}
