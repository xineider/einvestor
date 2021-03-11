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

const relatorioModel = require('../model/relatorioModel.js');

const regrasAlgoritimoModel = require('../model/regrasAlgoritimoModel.js');

const formCurrency = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2
});

const formCurrency2 = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 0
});



router.get('/', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 4;


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



		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'relatorios/relatorios', data: data, usuario: req.session.usuario});
	});
});


router.post('/select_nome_robo', function(req, res, next) {
	POST = req.body;
	console.log('estou alterando o table price selector ');
	console.log(POST);
	console.log('ttttttttttttttttttttttttttttttttttttttttt');

	var valor_minimo = parseInt(POST.valor_minimo);

	console.log('valor_minimo: ' + valor_minimo);

	roboModel.find({valor_minimo:{$lte:valor_minimo}},function(err,data_robo){

		data[req.session.usuario.id+'_robo']= data_robo;

		console.log('nnnnnnnnnnnnn select nome robo nnnnnnnnnnnnnnn');
		console.log(data);
		console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');

		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'relatorios/nomes_robo', data: data, usuario: req.session.usuario});

	});

});


router.post('/gerar_relatorio_robo', function(req, res, next) {
	POST = req.body;
	console.log('estou alterando o gerar relatorio robo ');
	console.log(POST);
	console.log('ttttttttttttttttttttttttttttttttttttttttt');

	

	roboModel.find({'_id':POST.id_robo},function(err,data_robo){

		console.log('------------- data_robo----------------');
		console.log(data_robo);
		console.log('---------------------------------------');

		relatorioModel.find({},function(err,data_relatorio){

			console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrr data_relatorio rrrrrrrrrrrrrrrrrrrrrrrrrrrr');
			console.log(data_relatorio);
			console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');

			console.log('estrategias');
			console.log(data_relatorio[0].estrategias);

			for(i=0;i < data_relatorio[0].estrategias.length; i++){
				var net_profit = ((formCurrency.format(data_relatorio[0].estrategias[i].net_profit * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].net_profit_exib = net_profit;

				var net_profit2 = ((formCurrency2.format(data_relatorio[0].estrategias[i].net_profit * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].net_profit_exib2 = net_profit2;


				var drawdown = ((formCurrency.format(data_relatorio[0].estrategias[i].drawdown * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].drawdown_exib = drawdown;

				var average_trade = ((formCurrency.format(data_relatorio[0].estrategias[i].average_trade * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].average_trade_exib = average_trade;

				var year_average = ((formCurrency.format(data_relatorio[0].estrategias[i].year_average * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].year_average_exib = year_average;

				var daily_profit = ((formCurrency.format(data_relatorio[0].estrategias[i].daily_profit * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].daily_profit_exib = daily_profit;

				var month_profit = ((formCurrency.format(data_relatorio[0].estrategias[i].month_profit * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].month_profit_exib = month_profit;

				var average_trade = ((formCurrency.format(data_relatorio[0].estrategias[i].average_trade * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].average_trade_exib = average_trade;
			}


			data[req.session.usuario.id+'_relatorio']= data_relatorio;


			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'relatorios/gerador_relatorio', data: data, usuario: req.session.usuario});
			

		}).sort({'_id':-1}).limit(1);
	});
	





});








module.exports = router;
