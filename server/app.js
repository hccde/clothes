let express = require('express');
let bootstrap = require('./controller/index');
let app = express();

var server = app.listen(3000,'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;
});

app.use(express.static(__dirname+'/www'));

bootstrap(app);
