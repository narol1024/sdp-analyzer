const Koa = require('koa');
const path = require('path');
const render = require('koa-ejs');
const open = require('open');

const app = new Koa();

render(app, {
  root: path.join(__dirname, '../public'),
  layout: false,
  viewExt: 'ejs',
});

function report(dep) {
  app.use(async function (ctx) {
    ctx.render('index', {
      dep,
    });
  });
  app.listen(3000);
  app.on('error', function (err) {
    console.log(err.stack);
  });
  const pageUrl = 'http://localhost:3000';
  open(pageUrl);
  console.info(`🎉 The analyzing was successful, opening ${pageUrl} to browse the report.`);
}

module.exports.report = report;
