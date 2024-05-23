import * as lodash  from 'lodash';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
// import ck from 'ckey';



export const decodeToken = (token: string) => {
    try {
      const decodedToken = jwt.decode(token);
      const data = decodedToken?.encryptedData;
      const secretKey = process.env.ENCODE_TOKEN!;
      const key = CryptoJS.enc.Utf8.parse(secretKey);
      const parts = data.split(":");
      const ciphertext1 = CryptoJS.enc.Base64.parse(parts[0]);
      const parsedIv = CryptoJS.enc.Base64.parse(parts[1]);
      const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext1 }, key, { iv: parsedIv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      const decryptData = decrypted.toString(CryptoJS.enc.Utf8);
      const decryptedData = JSON.parse(decryptData);
      return decryptedData;
    } catch (error) {
      console.error(error);
    }
  };