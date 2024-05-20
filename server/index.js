const path = require('path');
const Koa = require('koa');
const render = require('koa-ejs');
const static = require('koa-static');
const Router = require('koa-router');
const { analyze } = require('../src/index');

const app = new Koa();
const router = new Router();

render(app, {
  root: path.join(__dirname, './public'),
  layout: false,
  viewExt: 'ejs',
});

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    dep: [],
  });
  next();
});

router.get(
  '/:packageName',
  async (ctx, next) => {
    try {
      const searchWords = ctx.params.packageName;
      if (searchWords) {
        const res = await analyze(searchWords);
        ctx.results = res;
      }
    } catch (error) {
      ctx.errorMessage = error.message;
    }
    next();
  },
  async (ctx, next) => {
    if (ctx.errorMessage) {
      ctx.body = ctx.errorMessage;
    } else {
      await ctx.render('report', {
        dep: ctx.results,
      });
    }
    next();
  },
);

app
  .use(static(path.join(__dirname, './public/static')))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(9000)
  .on('error', function (err) {
    console.log(err.stack);
  });
