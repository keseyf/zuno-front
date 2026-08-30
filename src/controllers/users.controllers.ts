// controllers/users.controllers.ts
import api from "./api";

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    const response = await api.post("users/register", data);
    return response.data;
  } catch (error: any) {
    return error.response?.data ?? {
      status: "error",
      data: null,
      message: "Não foi possível conectar ao servidor."
    };
  }
}

export async function loginUser(data: { email: string; password: string }) {
  try {
    const response = await api.post("auth/login", data); // <- corrigido aqui

    if (response.data.status === "success" && response.data.data?.token) {
      localStorage.setItem("zuno_token", response.data.data.token);
    }

    return response.data;
  } catch (error: any) {
    return error.response?.data ?? {
      status: "error",
      data: null,
      message: "Não foi possível conectar ao servidor."
    };
  }
}

// controllers/users.controllers.ts
export async function getMe() {
  try {
    const response = await api.get("users/me");
    return response.data;
  } catch (error: any) {
    // Diferencia 401 (sessão realmente inválida) de outros erros (500, rede, timeout)
    if (error.response?.status === 401) {
      return {
        status: "error",
        data: null,
        message: "Sessão inválida.",
        _unauthorized: true
      };
    }

    return {
      status: "error",
      data: null,
      message: "Não foi possível verificar sua sessão.",
      _unauthorized: false
    };
  }
}

export function logout() {
  localStorage.removeItem("zuno_token");
}