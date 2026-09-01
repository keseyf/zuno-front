// controllers/recharge.controllers.ts
import api from "./api";

export interface RechargeData {
  id: string;
  userId: string;
  amount: number | string; // Decimal vem como string do backend
  paymentId: string | null;
  paymentMethod: string | null;
  qrCode: string | null;
  qrCodeBase64?: string; // só vem na criação, usado pra desenhar a imagem do QR
  status: "AGUARDANDO" | "APROVADO" | "RECUSADO" | "CANCELADO";
  createdAt: string;
  updatedAt: string;
}

// Cria uma recarga (gera cobrança Pix) — body: { amount }
export async function createRecharge(amount: number) {
  try {
    const response = await api.post("/recharges/register", { amount });
    return response.data;
  } catch (error: any) {
    return error.response?.data ?? {
      status: "error",
      data: null,
      message: "Não foi possível conectar ao servidor."
    };
  }
}

// Consulta o status atual de uma recarga (usado no polling)
export async function getRechargeStatus(id: string) {
  try {
    const response = await api.get("/recharges/status", { params: { id } });
    return response.data;
  } catch (error: any) {
    return error.response?.data ?? {
      status: "error",
      data: null,
      message: "Não foi possível verificar o status da recarga."
    };
  }
}

// Cancela uma recarga ainda aguardando pagamento
export async function cancelRecharge(id: string) {
  try {
    const response = await api.delete("/recharges/cancel", { data: { id } });
    return response.data;
  } catch (error: any) {
    return error.response?.data ?? {
      status: "error",
      data: null,
      message: "Não foi possível cancelar a recarga."
    };
  }
}