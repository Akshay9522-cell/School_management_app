import Cookies from "js-cookie";

export const setToken = (token: string) => {
  Cookies.set("token", token, {
    expires: 7,
    secure: window.location.protocol === "https:", // works on localhost + prod
    sameSite: "strict",
  });
};

export const getToken = () => Cookies.get("token") || null;
export const getRole = () => Cookies.get("role") || null;
export const getUserName = () => Cookies.get("userName") || null;
export const getTeacherId = () => Cookies.get("teacherId") || null;

export const logout = () => {
    Cookies.remove("token");
    Cookies.remove("userName");
}