//订单相关挨批
const Joi = require('joi');
const xml2js = require('xml2js');
const axios = require('axios');
const models = require('../models');
const config = require('../config');
const crypto = require('crypto');
const { jwtHeaderDefine } = require('../utils/router-help');

const GROUP_NAME = 'orders';

module.exports = [
	{
		method: 'POST',
		path: `/${GROUP_NAME}`,
		handler: async (req, rep) => {
			await models.sequelize
				.transaction((t) => {
					const result = models.orders
						.create(
							//使用了hapi-auth-jwt2插件
							//request.auth.credentials可以获得jwt解码所暴露出来的数据字段
							{ user_id: req.auth.credentials.userId },
							{ transaction: t }
						)
						.then((order) => {
							const goodsList = [];
							req.payload.goodsList.forEach(async (item) => {
								goodsList.push(
									models.order_goods.create({
										order_id: order.dataValues.id,
										goods_id: item.goods_id,
										count: item.count,
										single_price: await models.goods.findOne({
											where: { id: item.goods_id }
										})
									})
								);
							});
							return Promise.all(goodsList);
						});
					return result;
				})
				.then(() => {
					//事务已被提交
					rep('success');
				})
				.catch(() => {
					//事务已被回滚
					rep('error');
				});
		},
		config: {
			tags: [ 'api', GROUP_NAME ],
			description: '创建订单',
			//payload（request body）验证
			validate: {
				//通过 validate.payload 来约束
				payload: {
					goodsList: Joi.array().items(
						Joi.object().keys({
							goods_id: Joi.number().integer(),
							count: Joi.number().integer()
						})
					)
				},
				...jwtHeaderDefine
			}
		}
	},
	{
		method: 'POST',
		path: `/${GROUP_NAME}/{orderId}/pay`,
		handler: async (req, rep) => {
			//从用户表中获取openid
			const user = await models.users.findOne({ where: { id: req.auth.credentials.userId } });
			const { openid } = user;

			//商户在小程序中先调用该接口在微信支付服务后台生成预支付交易单，返回正确的预支付交易后调起支付。
			//https://api.mch.weixin.qq.com/pay/unifiedorder
			//构造unifiedorderObj所需入参 10个必填参数
			const unifiedorderObj = {
				//小程序id
				appid: config.wxAppid,
				//商品描述
				body: '小程序支付',
				//商户号 难搞哦
				mch_id: config.wxMchid,
				//随机字符串 32位以内
				nonce_str: Math.random().toString(36).substr(2, 15),
				//异步接收微信支付结果通知的回调地址
				notify_url: 'https://myhost.com/orders/pay/notify',
				//用户openid
				openid,
				//商户订单号
				out_trade_no: req.params.orderId,
				//调用支付接口的用户ip
				spbill_create_ip: req.info.remoteAddress,
				//总金额 单位 分
				total_fee: 1,
				//交易类型，默认
				trade_type: 'JSAPI'
			};

			//签名的数据
			const getSignData = (rawData, apiKey) => {
				let keys = Object.keys(rawData);
				keys = keys.sort();
				let str = '';
				keys.forEach((key) => {
					str += `&${key}=${rawData[key]}`;
				});
				str = str.substr(1);
				return crypto.createHash('md5').update(`${string}&key=${apiKey}`).digest('hex').toUpperCase();
			};

			//将基础数据信息sign签名
			const sign = getSignData(unifiedorderObj, config.wxPayApiKey);
			//需要被post的数据源
			const unifiedorderWithSign = {
				...unifiedorderObj,
				sign
			};
			//将需要post出去的订单参数转换为xml格式
			const builder = new xml2js.Builder({ rootName: 'xml', headless: true });
			const unifiedorderXML = builder.buildObject(unifiedorderWithSign);
			const result = await axios({
				url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
				method: 'POST',
				data: unifiedorderXML,
				headers: { 'content-type': 'text/xml' }
			});
			xml2js.parseString(result.data, (err, parsedResult) => {
				if (parsedResult.xml) {
					if (parsedResult.xml.return_code[0] === 'SUCCESS' && parsedResult.xml.result_code === 'SUCCESS') {
						//待签名的原始支付数据
						const replyData = {
							appId: parsedResult.xml.appid[0],
							timeStamp: (Date.now() / 1000).toString(),
							nonceStr: parsedResult.xml.nonce_str[0],
							package: `prepay_id=${parsedResult.xml.prepay_id[0]}`,
							singType: 'MD5'
						};
						replyData.paySign = getSignData(replyData, config.wxPayApiKey);
						rep(replyData);
					}
				}
			});
		},
		config: {
			tags: [ 'api', GROUP_NAME ],
			description: '支付moutiao订单',
			//动态路由的 params 验证
			//动态路由所依赖的变量 orderId 以 params 属性的字段来传递，orderId: Joi.string().required() 的描述，定义了 orderId 必须是字符串，且此参数必填
			validate: {
				params: {
					orderId: Joi.string().required()
				},
				...jwtHeaderDefine
			}
		}
	},
	{
		method: 'POST',
		path: `/${GROUP_NAME / pay / notify}`,
		handler: async (request, reply) => {
			xml2js.parseString(request.payload, async (err, parsedResult) => {
				if (parsedResult.xml.return_code[0] === 'SUCCESS') {
					// 微信统一支付状态成功，需要检验本地数据的逻辑一致性
					// 省略...细节逻辑校验
					// 更新该订单编号下的支付状态为已支付
					const orderId = parsedResult.xml.out_trade_no[0];
					const orderResult = await models.orders.findOne({ where: { id: orderId } });
					orderResult.payment_status = '1';
					await orderResult.save();
					//返回微信，校验成功
					const retVal = {
						return_code: 'SUCCESS',
						return_msg: 'OK'
					};
					const builder = new xml2js.Builder({
						rootName: 'xml',
						headless: true
					});
					reply(builder.buildObject(retVal));
				}
			});
		},
		config: {
			tags: [ 'api', GROUP_NAME ],
			auth: false,
			description: '支付成功的消息推送'
		}
	}
];
