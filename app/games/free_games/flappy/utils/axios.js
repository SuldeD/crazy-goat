import axios from "axios";

const _axios = axios.create({
  // baseURL: "https://api-game.mongolnft.com/api", //"http://localhost:8000/api",  //https://api-game.mongolnft.com
  baseURL: "https://api-game.mongolnft.com/api",
  timeout: 30000,
  options: {
    headers: {
      // post: {
      //   "Access-Control-Allow-Origin": true,
      // },
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Credentials": true,
      // 'Content-Type': 'application/json',
      // "Access-Control-Allow-Origin" : "*",
      // "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
      // "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    },
  },
  // mode: "no-cors"
});

export default _axios;
