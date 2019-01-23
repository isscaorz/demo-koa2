const Koa = require('koa'); // https://www.npmjs.com/package/koa 主框架koa
const app = new Koa(); //新建实例app
const views = require('koa-views'); // https://www.npmjs.com/package/koa-views 中间件，用以：模板渲染呈现
const json = require('koa-json'); // https://www.npmjs.com/package/koa-json 中间件，用以：将JSON响应美化打印，同时也将node对象流转为二进制
const onerror = require('koa-onerror'); // https://www.npmjs.com/package/koa-onerror 中间件，用以：hack ctx.onerror
const bodyparser = require('koa-bodyparser'); // https://www.npmjs.com/package/koa-bodyparser 中间件，基于co-body的body解析器，支持json,form和text(主用与post请求)
const logger = require('koa-logger'); // https://www.npmjs.com/package/koa-logger 中间件，开发风格记录器

const index = require('./routes/index');
const users = require('./routes/users');

// error handler -- 错误处理
onerror(app);

// middlewares -- 中间件
app.use(
	bodyparser({
		enableTypes: ['json', 'form', 'text']
	})
);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));  // https://www.npmjs.com/package/koa-static 中间件，静态文件服务

app.use(
	views(__dirname + '/views', {
		extension: 'pug'
	})
);

// logger -- 记录器
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes -- 路由  allowedMethods ：根据ctx.status（若为空或404）设置response响应头，推荐在所有路由中间件最后调用
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling -- 错误处理
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx);
});

module.exports = app;
