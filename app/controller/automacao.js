// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
// var MeusDadosModel = require('../model/minhaContaModel.js');
// var model = new MeusDadosModel;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));



const mongoose = require('mongoose');

const usuarioRoboModel = require('../model/usuarioRoboModel.js');

var regrasAlgoritmoModel = require('../model/regrasAlgoritmoModel.js');

var parametrosAlgoritmoModel = require('../model/parametrosAlgoritmoModel');


router.get('/', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 2;
	

	console.log('wwwwwwwwwwwwwwwwwwwww');
	console.log(data);
	console.log('wwwwwwwwwwwwwwwwwwwww');
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'automacao/conta', data: data, usuario: req.session.usuario});

});



router.get('/parametros', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 2;

	//get do robo para identificar o nome para o usuário, regra de 1x1
	usuarioRoboModel.aggregate([
	{
		$match:{id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)}
	},
	{
		$lookup:{
			from:'robo',
			localField:'id_robo',
			foreignField:'_id',
			as:'algoritmo'
		}

	}

	]).exec(function(err,data_algoritmo){

		console.log('-------------------data_algoritmo---------------------');
		console.log(data_algoritmo);
		console.log('------------------------------------------------------');

		
		data[req.session.usuario.id+'_usuario_algoritmo'] = data_algoritmo;

		regrasAlgoritmoModel.find({},function(err,data_regras_algoritmo){
			var data_atualizacao = data_regras_algoritmo[0].data_cadastro;
			var dataFormatada = ("0" + data_atualizacao.getDate()).substr(-2) + "/" + ("0" + (data_atualizacao.getMonth() + 1)).substr(-2) + "/" + data_atualizacao.getFullYear();
			data[req.session.usuario.id+'_header_data_atualizada'] = dataFormatada;
			data[req.session.usuario.id+'_parametros'] = '';

			console.log('wwwwwwwwwwwwwwwwwwwww');
			console.log(data);
			console.log('wwwwwwwwwwwwwwwwwwwww');
			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'automacao/parametros', data: data, usuario: req.session.usuario});

		}).sort({'_id':-1}).limit(1);
	});
});


router.get('/popup-carregar-algoritmo-termos', function(req, res, next) {

	console.log('estou no popup-carregar-algoritmo-termos');
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'automacao/popup_carregar_algoritmo_termos', data: data, usuario: req.session.usuario});
});

router.get('/popup-sincronizar-estrategia-termos', function(req, res, next) {

	console.log('estou no popup-sincronizar-estrategia-termos');
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'automacao/popup_sincronizar_estrategia_termos', data: data, usuario: req.session.usuario});
});




router.get('/carregar_parametros_algoritmo', function(req, res, next) {

	console.log('estou no carregar parametros algoritmo');



	parametrosAlgoritmoModel.find({},function(err,data_parametros){
		console.log('------------- data parametros ---------------------');
		console.log(data_parametros);
		console.log('---------------------------------------------------');

		data[req.session.usuario.id+'_parametros'] = data_parametros;

		console.log('-------------------------------');
		console.log(data);
		console.log('-------------------------------');
		console.log(data_parametros[0].setup_name[0]);


		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'automacao/parametros_formulario', data: data, usuario: req.session.usuario});


	}).sort({'_id':-1}).limit(1);

});


router.post('/sincronizar_estrategia_algoritmo', function(req, res, next) {

	console.log('estou no sincronizar_estrategia_algoritmo');

	POST = req.body;

	console.log('POST');
	console.log(POST);
	console.log('XXXXXXXXXXXXX');

})




module.exports = router;