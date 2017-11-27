let express = require('express');
let bootstrap = require('./controller/index');
let app = express();

let server = app.listen(80,'127.0.0.1', function () {
  let host = server.address().address;
  let port = server.address().port;
});

app.use(express.static(__dirname+'/www'));

bootstrap(app);
