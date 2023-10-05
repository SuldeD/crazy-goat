import { createStandaloneToast } from "@chakra-ui/react";
import crypto from "crypto-js";
import Buffer_ from "buffer/";

export const ShowErrToast = () => {
  const toast = createStandaloneToast();

  toast({ title: "Алдаа гарлаа", status: "error" });
};

export const handleNavigate = () => {
  const nextURL = `${window.location.origin}/`;
  const nextTitle = "Flappy Wolf by MongolNFT";
  const nextState = { additionalInformation: "Play to Burn!" };
  window.history.replaceState(nextState, nextTitle, nextURL);
};

export function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
}

export function nFormatter(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num;
}

export const makeSalt = (check_str) => {
  let xored = check_str[0];

  for (let i = 0; i < check_str.length - 1; i++) {
    xored = xor(xored, check_str[i + 1]);
  }

  return xored;
};

export async function makeHash(check_str, point) {
  let salt = makeSalt(check_str);

  const hash = crypto.HmacSHA256(point.toString(), salt.toString());

  // console.log(crypto.enc.Base64.stringify(hash));

  return crypto.enc.Base64.stringify(hash);
}

export function xor(a, b) {
  const { Buffer } = Buffer_;

  if (!Buffer.isBuffer(a)) a = new Buffer(a);
  if (!Buffer.isBuffer(b)) b = new Buffer(b);
  var res = [];
  if (a.length > b.length) {
    for (var i = 0; i < b.length; i++) {
      res.push(a[i] ^ b[i]);
    }
  } else {
    for (var i = 0; i < a.length; i++) {
      res.push(a[i] ^ b[i]);
    }
  }
  return new Buffer(res);
}

// eslint-disable-next-line no-unused-vars
function buf2hex(buffer) {
  // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
