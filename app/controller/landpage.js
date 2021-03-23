// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var data = {};
var app = express();


app.use(require('express-is-ajax-request'));

const roboModel = require('../model/roboModel.js');

const regrasAlgoritmoModel = require('../model/regrasAlgoritmoModel.js');

const formCurrency = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2
});




/* Conexão Mongo Db*/




/* GET pagina de landpage. */
router.get('/', function(req, res, next) {

	console.log('==================================');
	console.log('estou no landpage');
	console.log('==================================');

	regrasAlgoritmoModel.find({deletado:false},function(err,data_algoritmo){
		data.regras_algoritmo = data_algoritmo;

		roboModel.find({},function(err2,data_algoritmo){
			data.algoritmo = data_algoritmo;


			console.log('ggggggggggggggggggg get do landpage ggggggggggggggg');
			console.log(data);
			console.log('ggggggggggggggggggggggggggggggggggggggggggggggggggg');

			console.log('aaaaaaaaaaaaaaaaaaaaaa algoritmo aaaaaaaaaaaaaaaaaaaaaaaaa');
			console.log(data.algoritmo);
			console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
			if( !err2 ) {


			// res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLimpo', {html: 'landpage/landpage',title:'oi'});

			//res.render('landpage/index', {data:data,pedra:'cacau'});

			//res.render('landpage/index', { message: data});

			res.render('landpage/index', { message: data});

		}

	}).sort({'_id':-1});

	}).sort({'_id':-1}).limit(1);
});


module.exports = router;