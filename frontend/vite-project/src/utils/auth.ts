import Cookies from "js-cookie";

export const setToken = (token: string) => {
  Cookies.set("token", token, {
    expires: 7,
    secure: window.location.protocol === "https:", // works on localhost + prod
    sameSite: "strict",
  });
};

export const getToken = () => Cookies.get("token") || null;

export const logout = () => Cookies.remove("token");
