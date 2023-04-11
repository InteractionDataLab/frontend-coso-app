import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';

import { Context, cleanContext } from './utils/Context';

var baseAPI = "";
if("REACT_APP_BASE_API" in process.env) {
  baseAPI = process.env.REACT_APP_BASE_API + "/api/";
} else {
  baseAPI = "http://localhost:3000/api/";
}

const Api = axios.create({
  baseURL: baseAPI
});

const AxiosInterceptors = ({ children }) => {
  const history = useNavigate();

  const parseError = (error) => {
    if(error.response.status === 401 && (error.response.data === "Signature has expired" || error.response.data === "You need to sign in or sign up before continuing.")) {
      history("/logout");
    }

    return Promise.reject(error);
  }

  Api.interceptors.request.use((config) => {
    const apiToken = localStorage.getItem("Authorization") || '';
    config.headers = { 'Authorization': apiToken };
    return config;
  }, error => {
    return parseError(error);
  });

  Api.interceptors.response.use((response) => {
    return response;
  }, error => {
    return parseError(error);
  });

  return children;
}

export { Api, AxiosInterceptors };
