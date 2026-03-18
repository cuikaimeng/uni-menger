// crypto密码加密
import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse("crypto_secret_key");
const iv = CryptoJS.enc.Utf8.parse("crypto_secret_iv");

// 加密
export const encrypt = (data) => {
	if (typeof data === 'object') {
		data = JSON.stringify(data);
	}
	const encrypted = CryptoJS.AES.encrypt(data, key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	return encrypted.toString();
}

// 解密
export const decrypt = (encrypted) => {
	const bytes = CryptoJS.AES.decrypt(encrypted, key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	return bytes.toString(CryptoJS.enc.Utf8);
}