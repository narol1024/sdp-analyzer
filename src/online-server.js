const Koa = require('koa');
const path = require('path');
const render = require('koa-ejs');

const app = new Koa();
const Router = require('koa-router');
const { analyze } = require('./index');

const router = new Router();

render(app, {
  root: path.join(__dirname, '../public'),
  layout: false,
  viewExt: 'ejs',
});

router
  .get('/', async (ctx, next) => {
    await ctx.render('index', {
      dep: [],
    });
    next();
  })
  .get(
    '/:s',
    async (ctx, next) => {
      try {
        const searchWords = ctx.params.s;
        if (searchWords) {
          const res = await analyze(searchWords);
          ctx.results = res;
        }
      } catch (error) {
        ctx.errorMessage = error.message;
      }
      await next();
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
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(9000)
  .on('error', function (err) {
    console.log(err.stack);
  });
