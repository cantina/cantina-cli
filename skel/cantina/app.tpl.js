var app = require('cantina');

app.boot(function(err) {
  if (err) throw err;

  {{#if cantina-log}}
  // Logging
  require('cantina-log');
  if (!app.conf.get('test')) {
    app.log.replaceConsole();
  }
  {{/if}}

  // Error handler.
  app.on('error', function (err) {
    if (err.stack) {
      app.log.error(err.stack);
    }
    else {
      app.log.error(err);
    }
  });

  {{#each plugins}}
  require({{this}});
  {{/each}}

  app.start();
});