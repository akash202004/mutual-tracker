import type { User } from "../types";

const API_BASE = "http://localhost:5000/api";

interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    return data as AuthResponse;
  },

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const data = await response.json();
    return data as AuthResponse;
  },
};

export const getStoreduser = (): User | null => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};

export const storeUser = (user: User): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  localStorage.removeItem("user");
};
