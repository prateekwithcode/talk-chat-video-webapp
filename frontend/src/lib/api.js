import { axiosInstance } from "./axios";

export const signup=async (signupData) => {
      const response = await axiosInstance.post("/auth/signup", signupData);
      return response.data;
};


export const getAuthUser=async (signupData) => {
      const res = await axiosInstance.post("/auth/signup");
      return res.data;
};