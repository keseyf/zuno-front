import api from "./api";

export async function getAllProducts() {
  try {
    const response = await api.get("/products/view");
    return response.data;
  } catch (error: any) {
    return error.response?.data ?? {
      status: "error",
      data: null,
      message: "Não foi possível carregar os produtos."
    };
  }
}