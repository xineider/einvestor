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

const contatoFormularioModel = require('../model/contatoFormularioModel.js');


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

				res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/index',  message: data});

				//res.render('landpage/index', { message: data});

			}

		}).sort({'_id':-1});

	}).sort({'_id':-1}).limit(1);
});

router.post('/enviar-formulario-conhecer', function(req, res, next) {
	POST = req.body;

	console.log('estou no enviar formulario conhecer eeeeeeeeee');
	console.log(POST);
	console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');

	var pretencao_investimento;

	console.log('----------typeof POST.investe_em_renda_variavel != undefined');
	console.log(typeof POST.investe_em_renda_variavel != 'undefined');

	if(POST.investe_em_renda_variavel == 'nao' || typeof POST.investe_em_renda_variavel == 'undefined'){
		pretencao_investimento = 0;
		console.log('entrei aqui no nao');
	}else{
		pretencao_investimento = POST.pretencao_investimento;

	}


	const novo_contato = new contatoFormularioModel({ 						
		nome:POST.nome,
		email:POST.email,
		telefone:POST.telefone,
		como_chegou:POST.como_chegou,
		investe_em_renda_variavel:POST.investe_em_renda_variavel,
		pretencao_investimento:pretencao_investimento,
		deletado:false,
		data_cadastro:new Date()
	});


	if(pretencao_investimento == '100k'){
		pretencao_investimento = 0;
	}else if(pretencao_investimento == '200k'){
		pretencao_investimento = 0;
	}else if(pretencao_investimento == '300k'){
		pretencao_investimento = 300000;
	}else if(pretencao_investimento == '500k'){
		pretencao_investimento = 500000;
	}else if(pretencao_investimento == '1m'){
		pretencao_investimento = 1000000;
	}else if(pretencao_investimento == 'nao_pretendo'){
		pretencao_investimento = 0;
	}


	console.log('novo_contato');
	console.log(novo_contato);
	console.log('ccccccccccccccccccccccccccccccc');

	novo_contato.save(function (err) {
		if (err) {
			return handleError(err);
		}else{
			res.json(pretencao_investimento);
		}
	});





});






router.get('/whitepaper', function(req, res, next) {
	console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
	console.log('estou no whitepaper');
	console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
	res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/white_paper'});
});


router.get('/quem_somos', function(req, res, next) {
	console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
	console.log('estou no quem somos');
	console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
	res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/quem_somos'});
});










module.exports = router;