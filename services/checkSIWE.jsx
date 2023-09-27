import axios from "axios";
import Cookies from "universal-cookie";

async function verifyMessage() {
  const { ethereum } = window;
  if (!ethereum || !ethereum?.selectedAddress) {
    throw new Error("Ethereum wallet is not connected");
  }

  const address = ethereum.selectedAddress;
  const dateTime = new Date().getTime();
  const message = `Authentication required\nwallet:${address}\nnonce:${dateTime}`;

  const signature = await ethereum.request({
    method: "personal_sign",
    params: [address, message],
  });

  let data = {
    name: "test",
    message: message,
    address: address,
    nonce: dateTime,
    signature: signature,
  };

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api-game.mongolnft.com/api/login-web3/",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    const { token, user } = response.data.data;
    if (!token || !user) {
      throw new Error("Unexpected API response");
    }

    const cookies = new Cookies();
    cookies.set("jwtToken", token, { path: "/" });
    cookies.set("game_life", user.game_life_qty, { path: "/" });

    // console.log(JSON.stringify(response.data));
    return { result: response.data, success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: error };
  }
}

export { verifyMessage };
