import api from "./api";

export async function getAllServices(productId: string) {
  try {
    const response = await api.get(`/services/id/${productId}`);
    return response.data;
  } catch (error: any) {
    return error.response?.data ?? {
      status: "error",
      data: null,
      message: "Não foi possível carregar os serviços."
    };
  }
}