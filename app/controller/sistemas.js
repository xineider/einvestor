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


router.get('/', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 3;
	roboModel.find({},function(err,data_robo_t){
		data[req.session.usuario.id+'_robo_t']= data_robo_t;

		for(i=0;i < data_robo_t.length; i++){
			var valor_minimo_robo = formCurrency.format(data_robo_t[i].valor_minimo);
			valor_minimo_robo = ((valor_minimo_robo.replace('.','#')).replace(',','.')).replace('#',',');
			console.log('valor_minimo_robo');
			console.log(valor_minimo_robo);
			data_robo_t[i].valor_minimo_robo = valor_minimo_robo;
		}

		console.log('wwwwwwwwwwwwwwwwwwwww');
		console.log(data);
		console.log('wwwwwwwwwwwwwwwwwwwww');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'sistemas/automacao', data: data, usuario: req.session.usuario});
	});
});

router.get('/forma_pagamento', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 3;
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'sistemas/forma_pagamento', data: data, usuario: req.session.usuario});
});

router.get('/white_box', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 3;
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'sistemas/white_box', data: data, usuario: req.session.usuario});
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


			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'sistemas/table_price', data: data, usuario: req.session.usuario});


		}).sort({'_id':-1});

	}).sort({'_id':-1}).limit(1);


});





module.exports = router;