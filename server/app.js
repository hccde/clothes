let express = require('express');
let bootstrap = require('./controller/index');
let compress = require('compression');

let app = express();
app.use(compress());
let server = app.listen(80,'localhost', function () {
  let host = server.address().address;
  let port = server.address().port;
});

app.use(express.static(__dirname+'/www',{
  maxAge:60*3600*1000
}));

bootstrap(app);
