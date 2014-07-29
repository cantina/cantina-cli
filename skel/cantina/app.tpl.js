var app = require('cantina').createApp();

app.boot(function(err) {
  if (err) throw err;

  // Logging
  app.require('cantina-log');
  if (!app.conf.get('test')) {
    app.log.replaceConsole();
  }

  // Error handler.
  app.on('error', function (err) {
    if (err.stack) {
      app.log.error(err.stack);
    }
    else {
      app.log.error(err);
    }
  });

  {{#each plugins}}app.require('{{this}}');
  {{/each}}

  {{#if cantina-web}}app.load('web');
  {{/if}}

  app.start();
});
