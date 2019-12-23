//识别用户userId
const JWT = require('jsonwebtoken');
const Joi = require('joi');
const axios = require('axios');
const models = require('../models');
const config = require('../config');
const decryptData = require('../utils/decrypted-data');
const GROUP_NAME = 'users';

module.exports = [
	{
		//创建一个createJWT接口
		method: 'POST',
		path: `/${GROUP_NAME}/createJWT`,
		handler: async (request, repy) => {
			const generateJWT = (jwtInfo) => {
				const payload = {
					userId: jwtInfo.userId,
					//Date.now()返回自1970年1月1日 00:00:00 UTC到当前时间的毫秒数
					//等同于new Date().getTime()
					exp: Math.floor(Date.now() / 1000) + 10 * 60
				};
				//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjk1MjcsImV4cCI6MTU3NzA3OTk4NywiaWF0IjoxNTc3MDc5Mzg3fQ.h5vHP18vLvWv_xkk_GE1vJrmz8nejidxLh_8Bo5D7i4
				return JWT.sign(payload, config.jwtSecret);
			};
			repy(generateJWT({ userId: 9527 }));
		},
		//为 REST 接口添加 Swagger 标记
		config: {
			tags: [ 'api', GROUP_NAME ],
			description: '用于测试的用户JWT签发',
			//auth:false约定接口不参与JWT验证，结合hapi-auth-jwt使用
			auth: false
		}
	},
	{
		method: 'POST',
		path: `/${GROUP_NAME}/wxLogin`,
		handler: async (request, repy) => {
			//小程序appid
			const appid = config.wxAppid;
			//小程序appsecret
			const secret = config.wxSecret;
			//前端传来的code => 微信临时登录code
			//前端传来的encryptedData =>  加密的用户信息，包含 openid 和 unionid
			//前端传来的iv =>  对 encryptedData 加密算法的初始向量，解密 encrytedData 时要用到。
			const { code, encryptedData, iv } = request.payload;

			//node通过微信接口获取openid和session_key
			const response = await axios({
				url: 'https://api.weixin.qq.com/sns/jscode2session',
				method: 'GET',
				params: {
					appid,
					secret,
					js_code: code,
					grant_type: 'authorization_code'
				}
			});
			const { openid, session_key: sessionKey } = response.data;

			// 基于 openid 查找或创建一个用户
			const user = await models.users.findOrCreate({
				where: { open_id: openid }
			});

			// decrypt 解码用户信息
			const userInfo = decryptData(encryptedData, iv, sessionKey, appid);
			//更新user表中的用户资料信息
			await models.users.update(
				{
					nick_name: userInfo.nickName,
					gender: userInfo.gender,
					avatar_url: userInfo.avatarUrl,
					open_id: userInfo.openid,
					session_key: userInfo.sessionKey
				},
				{ where: { open_id: openid } }
			);

			//签发jwt
			const generateJWT = (jwtInfo) => {
				const payload = {
					userId: jwtInfo.userId,
					//Date.now()返回自1970年1月1日 00:00:00 UTC到当前时间的毫秒数
					//等同于new Date().getTime()
					exp: Math.floor(Date.now() / 1000) + 10 * 60
				};
				return JWT.sign(payload, config.jwtSecret);
			};
			repy(
				generateJWT({
					userId: user[0].id
				})
			);
		},
		config: {
			auth: false,
			//注册swagger文档
			tags: [ 'api', GROUP_NAME ],
			validate: {
				payload: {
					code: Joi.string().required().description('微信用户临时code'),
					encryptedData: Joi.string().required().description('微信用户encryptedData信息'),
					iv: Joi.string().required().description('微信用户iv信息')
				}
			}
		}
	}
];
