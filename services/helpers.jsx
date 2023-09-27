import crypto from "crypto-js";
import Buffer_ from "buffer/";

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

export function UnixToDate({ timestamp }) {
  const date = new Date(timestamp * 1000);
  const dateString = date.toLocaleDateString(); // or date.toLocaleString() for including time

  return <div>{dateString}</div>;
}
