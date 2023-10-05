import axios from "../utils/axios";

export const LoginReq = async (body) => {
  // const res = await axios.get("/homepage/", body);
  axios.defaults.headers["Authorization"] = ``;
  const res = await axios.post("/login-web3/", body);

  const { data } = res;

  if (data.return_code === 1) {
    const { data: logInfo } = data;

    if (logInfo.token) {
      axios.defaults.headers["Authorization"] = `jwt ${logInfo.token}`;
    }
  }

  return res.data;
};
