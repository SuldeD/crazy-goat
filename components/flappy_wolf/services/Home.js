import axios from "../utils/axios";

export const GetInitials = async () => {
  // const res = await axios.get("/homepage/", body);
  const res = await axios.get("/homepage/");

  return res.data;
};
