var express = require('express');
var session = require('express-session');
var parseurl = require('parseurl');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Control = require('./app/controller/control.js');
const fileUpload = require('express-fileupload');

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

var login = require('./app/controller/login');
var landpage = require('./app/controller/landpage');
var index = require('./app/controller/index');
var api = require('./app/controller/api');
var minha_conta = require('./app/controller/minha_conta');
var administracao = require('./app/controller/administracao');
var quem_somos = require('./app/controller/quem_somos');
var automacao = require('./app/controller/automacao');
var relatorios = require('./app/controller/relatorios');
var white_paper = require('./app/controller/white_paper');
var treinamento = require('./app/controller/treinamento');
var educacao = require('./app/controller/educacao');
var politica_privacidade = require('./app/controller/politica_privacidade');
var termos_uso = require('./app/controller/termos_uso');
var faq = require('./app/controller/faq');
var sistemas = require('./app/controller/sistemas');


var app = express();
var control = new Control;

var sassMiddleware = require('node-sass-middleware');

app.use(require('express-is-ajax-request'));
// INICIANDO SESSION
app.set('trust proxy', 1); // trust first proxy


const uri = 'mongodb+srv://admin_21:1UNb6gtwBmRoJud2@cluster0.xohbs.mongodb.net/e12o)1?retryWrites=true&w=majority';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});


app.use(session({
  secret: 'senha_mega_complexa_robo_pro_moq)21',
  resave: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  saveUninitialized: false
}));

mongoose.pluralize(null);


// app.use(function(req,res,next){
//   req.session.usuario = {};
//   req.session.usuario.id = 1;
//   req.session.usuario.nivel = 1;
//   next();
// });

app.use(function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

//Verifica usuario se esta logado ou não
// app.use(function (req, res, next) {
//   var pathname = parseurl(req).pathname;

  // var id = req.headers['authority-optima-id'];
  // var hash = req.headers['authority-optima-hash'];
  // var nivel = req.headers['authority-optima-nivel'];

  // if ((pathname != '/' && pathname != '') && 
  //     (pathname.indexOf("css") == -1 && pathname.indexOf("js") == -1 && pathname.indexOf("imgs") == -1 && pathname.indexOf("fonts") == -1) && 
  //       req.isAjaxRequest() == true){
  //   var id = req.headers['authority-optima-id'];
  //   var hash = req.headers['authority-optima-hash'];
  //   var nivel = req.headers['authority-optima-nivel'];
  //   verificacao.VerificarUsuario(id, hash,nivel).then(data => {
  //     if (data.length > 0) {
  //       req.session.usuario = {};
  //       req.session.usuario.id = id;
  //       req.session.usuario.hash_login = hash;
  //       req.session.usuario.nivel = nivel;
  //       req.session.usuario.id_empresa = data[0].id_empresa;
  //       next();
  //     } else {
  //       req.session.destroy(function(err) {
  //         res.json('<img src="/assets/imgs/logout.gif"><script>setTimeout(function(){ window.location.replace("/"); }, 4100);</script>');
  //       });
  //     }
  //   });
  // } else if (control.Isset(req.session.usuario, false)
  //   && (pathname != '/' && pathname != '')
  //     && (pathname.indexOf("css") == -1 && pathname.indexOf("js") == -1 && pathname.indexOf("imgs") == -1 && pathname.indexOf("fonts") == -1)) {
  //   res.redirect('/');
  // } else {
  //   next();
  // }
// });

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /assets
//app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());





app.use(sassMiddleware({
  src: __dirname,
  debug: true,
  outputStyle: 'compressed'
}));




app.use("/public", express.static(__dirname + '/public'));



// app.use(express.static(path.join(__dirname, '/assets')));
// console.log(path.join(__dirname, 'assets'));

app.use('/', landpage);
app.use('/plataforma', login);
app.use('/plataforma/sistema', index);
app.use('/plataforma/sistema/administracao', administracao);
app.use('/plataforma/sistema/api', api);
app.use('/plataforma/sistema/minha_conta', minha_conta);
app.use('/plataforma/sistema/automacao', automacao);
app.use('/plataforma/sistema/relatorios', relatorios);
app.use('/plataforma/sistema/white_paper', white_paper);
app.use('/plataforma/sistema/treinamento', treinamento);
app.use('/plataforma/sistema/educacao', educacao);
app.use('/plataforma/sistema/quem_somos', quem_somos);
app.use('/plataforma/sistema/politica_privacidade', politica_privacidade);
app.use('/plataforma/sistema/termos_uso', termos_uso);
app.use('/plataforma/sistema/faq', faq);
app.use('/plataforma/sistema/sistemas', sistemas);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log('ERROR --------------------- ERROR');
  console.log(err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log('req.session');
  console.log(req.session);

 //  if(err.message == 'Not Found'){
 //    console.log('nao foi achado!!');
 //    res.render('login/index', { erro: 'Página não existente, faça o login para acessar o sistema.', tipo_erro: '404' });
 //  }

	// if (typeof req.session.id_usuario != 'undefined' && req.session.id_usuario != 0) {
 //    console.log('entrei no primeiro if');
 //  	res.render('error', { erro: 'Página não existente.', tipo_erro: '404' });
 //  } else {
 //    console.log('entrei aqui')
 //  	res.render('login/index', { erro: 'Usuário Deslogado.', tipo_erro: '410' });
 //  }

 if(err.message == 'Not Found'){
  console.log('nao foi achado!!');
  res.render('landpage/index', { erro: 'Página não existente, faça o login para acessar o sistema.', tipo_erro: '404' });
}

if (typeof req.session.id_usuario != 'undefined' && req.session.id_usuario != 0) {
  console.log('entrei no primeiro if');
  res.render('error', { erro: 'Página não existente.', tipo_erro: '404' });
} else {
  console.log('entrei aqui')
  res.render('landpage/index', { erro: 'Usuário Deslogado.', tipo_erro: '410' });
}



});
// app.listen(3000);

module.exports = app;
