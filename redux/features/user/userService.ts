import axios from "axios";
import { UserProfile } from "./userTypes";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function fetchUserProfile(token: string): Promise<UserProfile> {
  const response = await axios.get<UserProfile>(
    `${API_BASE_URL}/api/user/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
