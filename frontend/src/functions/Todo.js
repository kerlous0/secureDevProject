import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/todo",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchTodo = async () => {
  const response = await apiClient.get("/get");
  return response.data;
};

export const createTodo = async (todo) => {
  const response = await apiClient.post("/add", todo);
  return response.data;
};

export const updateTodo = async (updatedTodo) => {
  const { id } = updatedTodo;
  const response = await apiClient.put(`/update/${id}`, updatedTodo);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await apiClient.delete(`/delete/${id}`);
  return response.data;
};
