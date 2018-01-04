let express = require('express');
let bootstrap = require('./controller/index');
let compress = require('compression');
let port = 80;
if(process.env.NODE_ENV == 'dev'){
  port = 3000;
}
let app = express();
app.use(compress());
let server = app.listen(port,'0.0.0.0', function () {
  let host = server.address().address;
  let port = server.address().port;
});

app.use(express.static(__dirname+'/www',{
  maxAge:60*3600*1000
}));

bootstrap(app);
