// src/utils/authStorage.js

import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "userToken";

// Guardar el token
export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error guardando el token:", error);
  }
};

// Recuperar el token
export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error recuperando el token:", error);
    return null;
  }
};

// Eliminar el token
export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error eliminando el token:", error);
  }
};
