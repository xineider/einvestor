// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var data = {};
var app = express();

const mongoose = require('mongoose');

app.use(require('express-is-ajax-request'));


const regrasAlgoritmoModel = require('../model/regrasAlgoritmoModel.js');

const contatoFormularioModel = require('../model/contatoFormularioModel.js');

const usuarioModel = require('../model/usuariosModel.js');

var usuarioStatusModel = require('../model/usuarioStatusModel.js');

var usuarioRoboModel = require('../model/usuarioRoboModel.js');


var roboModel = require('../model/roboModel.js');




/* Conexão Mongo Db*/




/* GET pagina de landpage. */
router.get('/', function(req, res, next) {

	console.log('==================================');
	console.log('estou no landpage');
	console.log('==================================');

	data.numero_menu = 1;

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

	var possui_30_dias = false;


	if(POST.acess_key == 'einvestor30g'){
		console.log('é igual ao acess key');
		possui_30_dias = true;
	}

	console.log('novo_contato');
	console.log(novo_contato);
	console.log('ccccccccccccccccccccccccccccccc');

	novo_contato.save(function (err) {
		if (err) {
			return handleError(err);
		}else{
			res.json({pretencao_investimento:pretencao_investimento,possui_30dias:possui_30_dias});
		}
	});





});


router.get('/assinar_30dias_gratuitos2', function(req, res, next) {

	res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/parabens_escolha_sistema',  message: data});

});



router.post('/criar-usuario-redirecionar', function(req, res, next) {

	POST = req.body;

	console.log('cccccccccccccc estou no crair usuario redirecionar ccccccccccccccccccccccccc');
	console.log(POST);
	console.log('cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc');

	POST.senha = control.Encrypt(POST.senha);
	POST.email = POST.email.toLowerCase();
	POST.email = POST.email.trim();



	roboModel.findOne({valor:8},function(err,data_algoritmo){

		console.log('------------------ data_algoritmo -----------------');
		console.log(data_algoritmo);
		console.log('---------------------------------------------------');

		console.log('data_algoritmo._id')
		console.log(data_algoritmo._id);




		const novo_usuario = new usuarioModel({ 						
			nome:POST.nome,
			email:POST.email,
			senha:POST.senha,
			telefone:POST.telefone,
			foto:'',
			cpf:POST.cpf,
			nivel:3,
			deletado:false,
			data_cadastro:new Date()
		});

		console.log('-------------------- novo usuario ----------------------');
		console.log(novo_usuario);
		console.log('--------------------------------------------------------');



		novo_usuario.save(function (err,usuario_retorno_save) {

			console.log('err');
			console.log(err);

			console.log('usuario_retorno_save');
			console.log(usuario_retorno_save);
			console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrr');


			if (err) {
				return handleError(err);
			}else{	


				const novo_status_usuario = new usuarioStatusModel({
					id_usuario:mongoose.Types.ObjectId(usuario_retorno_save._id),
					numero_operacoes:0,
					sistema_online:false,
					nome_algoritmo_escolhido:'E-008',
					valor_aplicado:100000,
					pagamento:false,
					conta:'Não Sincronizado',
					algoritmo:'Não Sincronizado',
					aceite_termos_inicio:false,
					deletado:false,
					data_atualizacao:new Date(),
					data_cadastro:new Date()
				});

				console.log('novo_status_usuario');
				console.log(novo_status_usuario);
				console.log('ssssssssssssssssssssssssssssss');




				novo_status_usuario.save(function(err){


					if (err) {
						return handleError(err);
					}else{

						const novo_usuario_algoritmo = new usuarioRoboModel({
							id_usuario:mongoose.Types.ObjectId(usuario_retorno_save._id),
							id_robo:mongoose.Types.ObjectId(data_algoritmo._id),
							rentabilidade_aa:85.36
						});

						console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaa');
						console.log(novo_usuario_algoritmo);
						console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaa');


						novo_usuario_algoritmo.save(function(err){

							req.session.usuario = {};
							req.session.usuario.id = usuario_retorno_save._id;
							req.session.usuario.nivel =usuario_retorno_save.nivel;
							req.session.usuario.nome = usuario_retorno_save.nome;
							req.session.usuario.email = usuario_retorno_save.email;


							console.log('rrrrrrrrrrrrrr req.session.usuario rrrrrrrrrrrrrrr');
							console.log(req.session.usuario);
							console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');



							res.redirect('/plataforma/sistema/automacao');

						});


					}


				});








			}
		});


	});



	
});


router.get('/assinar_30dias_gratuitos/:algoritmo/:capital', function(req, res, next) {

	var algoritmo = req.params.algoritmo;
	var capital = req.params.capital;

	console.log('algoritmo:' + algoritmo);
	console.log('capital:' + capital);

	console.log('estou no assinar_30_dias_gratuitos');

	console.log('');
	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');




	res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/parabens_escolha_sistema',  message: data});




});






router.get('/whitepaper', function(req, res, next) {
	console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
	console.log('estou no whitepaper');
	console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');

	data.numero_menu = 2;

	res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/white_paper',message: data});
});


router.get('/quem_somos', function(req, res, next) {
	console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
	console.log('estou no quem somos');
	console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
	data.numero_menu = 3;
	res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/quem_somos',message: data});
});










module.exports = router;