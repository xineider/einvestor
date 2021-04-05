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

const usuarioModel = require('../model/usuariosModel.js');

const roboModel = require('../model/roboModel.js');

const regrasAlgoritmoModel = require('../model/regrasAlgoritmoModel.js');

const formCurrency = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2
});

var usuarioCorretoraModel = require('../model/usuarioCorretoraModel.js');
var usuarioParametrosAlgoritmoModel = require('../model/usuarioParametrosAlgoritmoModel');

var usuarioStatusModel = require('../model/usuarioStatusModel.js');
var moment = require('moment');
moment.locale('pt-br');


router.get('/', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 3;

	usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){

		var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
		var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');
		var valor_aplicado_u = data_usuario_status[0].valor_aplicado;
		var valor_aplicado_uf = valor_aplicado_u.toLocaleString('pt-br', {minimumFractionDigits: 2});	
		data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;
		data_usuario_status[0].valor_aplicado_f = valor_aplicado_uf;
		data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;


		usuarioCorretoraModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_corretora){
			data[req.session.usuario.id+'_usuario_corretora']= data_usuario_corretora;

			usuarioParametrosAlgoritmoModel.find({},function(err,data_parametros_usuario){
				data[req.session.usuario.id+'_usuario_parametros'] = data_parametros_usuario;


				roboModel.find({},function(err,data_algoritmo){
					data[req.session.usuario.id+'_algoritmo']= data_algoritmo;

					for(i=0;i < data_algoritmo.length; i++){
						var valor_minimo_robo = formCurrency.format(data_algoritmo[i].valor_minimo);
						valor_minimo_robo = ((valor_minimo_robo.replace('.','#')).replace(',','.')).replace('#',',');
						console.log('valor_minimo_robo');
						console.log(valor_minimo_robo);
						data_algoritmo[i].valor_minimo_robo = valor_minimo_robo;
					}

					regrasAlgoritmoModel.find({deletado:false},function(err,data_regras_algoritmo){
						data[req.session.usuario.id+'_regras_algoritmo'] = data_regras_algoritmo;


						console.log('wwwwwwwwwwwwwwwwwwwww');
						console.log(data);
						console.log('wwwwwwwwwwwwwwwwwwwww');

						res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'upgrade/upgrade', data: data, usuario: req.session.usuario});
					}).sort({'_id':-1}).limit(1);
				}).sort({'_id':-1});
			}).sort({'_id':-1}).limit(1);
		}).sort({'_id':-1}).limit(1);
	}).sort({'_id':-1}).limit(1);
});

router.get('/forma_pagamento', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 3;

	usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){

		var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
		var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');
		data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;
		data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;


		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'upgrade/forma_pagamento', data: data, usuario: req.session.usuario});
	}).sort({'_id':-1}).limit(1);
});

router.get('/white_box', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 3;

	usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){

		var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
		var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');
		data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;
		data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;
		
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'upgrade/white_box', data: data, usuario: req.session.usuario});
	}).sort({'_id':-1}).limit(1);

});


router.get('/escolha_algoritmo', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 3;

	usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){

		var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
		var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');
		data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;
		data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;
		
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'upgrade/escolha_algoritmo', data: data, usuario: req.session.usuario});
	}).sort({'_id':-1}).limit(1);

});


router.post('/select_table_price', function(req, res, next) {
	POST = req.body;
	console.log('estou alterando o table price selector ');
	console.log(POST);
	console.log('ttttttttttttttttttttttttttttttttttttttttt');

	var valor_minimo = parseInt(POST.valor_minimo);

	console.log('valor_minimo: ' + valor_minimo);

	regrasAlgoritmoModel.find({deletado:false},function(err,data_algoritmo){
		console.log('-data_algoritmo aaaaaaaaaaaaaaaaaa');
		console.log(data_algoritmo);
		console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
		data[req.session.usuario.id+'_algoritimo'] = data_algoritmo;


		roboModel.find({valor_minimo:{$lte:valor_minimo}},function(err,data_robo){
			
			data[req.session.usuario.id+'_capital']= valor_minimo;


			console.log('============================================ data ==========================');
			console.log(data);
			console.log('============================================================================');


			

			for(i=0;i < data_robo.length; i++){
				var rentabilidade_aa = ((data_algoritmo[0].media_ano * data_robo[i].multiplicador) / valor_minimo) * 100;
				var volatilidade = data_algoritmo[0].volatilidade * data_robo[i].multiplicador;
				var maximo_rebaixamento = volatilidade /  valor_minimo * 100;
				var melhor_mes = data_algoritmo[0].melhor_mes * data_robo[i].multiplicador / valor_minimo * 100;
				var pior_mes = data_algoritmo[0].pior_mes * data_robo[i].multiplicador / valor_minimo * 100;

				volatilidade = formCurrency.format(volatilidade);
				volatilidade = ((volatilidade.replace('.','#')).replace(',','.')).replace('#',',');

				var preco_robo = formCurrency.format(data_robo[i].preco);
				preco_robo = ((preco_robo.replace('.','#')).replace(',','.')).replace('#',',');
				console.log('preco_robo:' + preco_robo);
				data_robo[i].preco_robo = preco_robo;



				console.log('*******************************************************');
				console.log('valor_minimo: ' + valor_minimo);
				console.log('rentabilidade_aa: ' + rentabilidade_aa);
				console.log('volatilidade: ' + volatilidade);
				console.log('maximo_rebaixamento: ' + maximo_rebaixamento);
				console.log('melhor_mes: ' + melhor_mes);
				console.log('pior_mes: ' + pior_mes);
				console.log('******************************************************');
				rentabilidade_aa = parseFloat(rentabilidade_aa).toFixed(2).replace('.',',');
				maximo_rebaixamento = parseFloat(maximo_rebaixamento).toFixed(2).replace('.',',');
				melhor_mes = parseFloat(melhor_mes).toFixed(2).replace('.',',');;
				pior_mes = parseFloat(pior_mes).toFixed(2).replace('.',',');;




				data_robo[i].rentabilidade_aa = rentabilidade_aa;
				data_robo[i].volatilidade =  volatilidade;
				data_robo[i].maximo_rebaixamento =  maximo_rebaixamento;
				data_robo[i].melhor_mes =  melhor_mes;
				data_robo[i].pior_mes =  pior_mes;

			}



			data[req.session.usuario.id+'_robo']= data_robo;


			// console.log('rrrrrrrrrrrrrrrr');
			// console.log(data_robo);
			// console.log('rrrrrrrrrrrrrrrr');


			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'upgrade/table_price', data: data, usuario: req.session.usuario});


		}).sort({'_id':-1});

	}).sort({'_id':-1}).limit(1);


});





module.exports = router;