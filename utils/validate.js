// 验证方法工具

/**
 * 验证手机号
 */
export const validatePhone = (phone) => {
	return /^1[34578][0-9]{9}$/.test(phone)
}