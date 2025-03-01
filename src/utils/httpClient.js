import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
export function get(path) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return axios.get(`${BASE_URL}${path}`, requestOptions);
}
export function post(path, body) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify(body);
  var requestOptions = {
    method: "POST",
    body: raw,
    headers: myHeaders,
    redirect: "follow",
  };
  return axios.post(`${BASE_URL}${path}`, requestOptions);
}

