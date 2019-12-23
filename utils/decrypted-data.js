//node内置加解密模块
const crypto = require('crypto');

const decryptData = (encryptedData, iv, sessionKey, appid) => {
	//base64 decode
	const encryptedDataNew = Buffer.from(encryptedData, 'base64');
	const sessionKeyNew = Buffer.from(sessionKey, 'base64');
	const ivNew = Buffer.from(iv, 'base64');

	//解码后的内容
	let decoded = '';
	try {
		// 解密，使用的算法是 aes-128-cbc
		const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKeyNew, ivNew);
		// 设置自动 padding 为 true，删除填充补位
		decipher.setAutoPadding(true);
		decoded = decipher.update(encryptedDataNew, 'binary', 'utf8');
		decoded += decipher.final('utf8');
		//把字符串转换为对象
		decoded = JSON.parse(decoded);
	} catch (err) {
		throw new Error('Illegal Buffer');
	}

	// 解密后的用户数据中会有一个 watermark 属性，这个属性中包含这个小程序的 appid 和时间戳，下面是校验 appid
	if (decoded.watermark.appid !== appid) {
		throw new Error('Illegal Buffer');
	}

	return decoded;
};

module.exports = decryptData;
