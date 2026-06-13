import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const isWeb = Platform.OS === "web";

async function setItem(key, value) {
  if (isWeb) {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getItem(key) {
  if (isWeb) {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
}

async function removeItem(key) {
  if (isWeb) {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export async function saveTokens(accessToken, refreshToken) {
  await setItem("accessToken", accessToken);
  if (refreshToken) await setItem("refreshToken", refreshToken);
}

export async function getAccessToken() {
  return await getItem("accessToken");
}

export async function getRefreshToken() {
  return await getItem("refreshToken");
}

export async function clearTokens() {
  await removeItem("accessToken");
  await removeItem("refreshToken");
}
