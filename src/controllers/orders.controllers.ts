import api from "./api";
export async function getMyOrders() {
  try {
    const response = await api.get("orders/me");
    return response.data;
  } catch (error: any) {
    return error.response?.data ?? {
      status: "error",
      data: null,
      message: "Não foi possível conectar ao servidor."
    };
  }
}

export async function createOrder(data: {
  productId: string | null;
  serviceId: string | null;
  url: string
}) {
  try {
    if (data.productId ===null || data.serviceId===null ){
        return {
      status: "error",
      data: null,
      message: "Servico e/ou plataforma nao informados."
    };
    }
    const response = await api.post("/orders/register", {Data:data});
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    console.log(error.response?.data.message)
    return error.response?.data ?? {
      status: "error",
      data: null,
      message: "Não foi possível conectar ao servidor."
    };
  }
}