import axios from "axios";
import { useState } from "react";

// const apiUrl = import.meta.env.VITE_API_BACKEND_URL;

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BACKEND_URL,
    withCredentials: true, // Enable sending HTTP-only cookies
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const request = async (
    method,
    endpoint,
    requestData = null,
    queryParams = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance({
        method,
        url: endpoint,
        params: queryParams,
        data: requestData,
      });

      setData(response.data.products);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // HTTP GET request
  const get = (endpoint, queryParams = {}) => {
    return request("get", endpoint, null, queryParams);
  };

  // HTTP POST request
  const post = (endpoint, data, queryParams = {}) => {
    console.log(data, endpoint);
    return request("post", endpoint, data, queryParams);
  };

  // HTTP PUT request
  const put = (endpoint, data, queryParams = {}) => {
    return request("put", endpoint, data, queryParams);
  };

  // HTTP PATCH request
  const patch = (endpoint, data, queryParams = {}) => {
    return request("patch", endpoint, data, queryParams);
  };

  // HTTP DELETE request
  const del = (endpoint, queryParams = {}) => {
    // console.log(endpoint, queryParams);
    return request("delete", endpoint, null, queryParams);
  };

  return {
    loading,
    data,
    error,
    get,
    post,
    put,
    patch,
    del,
  };
};

export default useApi;
