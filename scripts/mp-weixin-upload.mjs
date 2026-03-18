import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ci from 'miniprogram-ci'

const projectPath = process.env.WECHAT_PROJECT_PATH
	? path.resolve(process.env.WECHAT_PROJECT_PATH)
	: path.resolve('dist/build/mp-weixin')

const appid = process.env.WECHAT_APPID || process.env.WX_APPID || ''
const privateKeyPath = process.env.WECHAT_PRIVATE_KEY_PATH
	? path.resolve(process.env.WECHAT_PRIVATE_KEY_PATH)
	: ''
const version = process.env.WECHAT_VERSION || '0.0.0'
const desc = process.env.WECHAT_DESC || ''
const robot = Number(process.env.WECHAT_ROBOT || '1')

if (!appid) {
	throw new Error('Missing env: WECHAT_APPID')
}
if (!privateKeyPath) {
	throw new Error('Missing env: WECHAT_PRIVATE_KEY_PATH')
}
if (!fs.existsSync(privateKeyPath)) {
	throw new Error(`Private key not found: ${privateKeyPath}`)
}
if (!fs.existsSync(projectPath)) {
	throw new Error(`Project path not found: ${projectPath}`)
}

const privateKey = fs.readFileSync(privateKeyPath, 'utf8')

const project = new ci.Project({
	appid,
	type: 'miniProgram',
	projectPath,
	privateKey,
	ignores: ['node_modules/**/*'],
})

await ci.upload({
	project,
	version,
	desc,
	robot,
	setting: {
		es6: true,
		minify: true,
	},
})

