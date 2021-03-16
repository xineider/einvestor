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

const regrasAlgoritmoModel = require('../model/regrasAlgoritmoModel.js');

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

function transformar_porcentagem(valor,robo,capital){
	console.log('transformar_porcentagem');
	console.log('valor: ' + valor);
	console.log('robo: ' + robo);
	console.log('capital: ' + capital);

	var arrumado = valor * robo / capital * 100;
	arrumado = parseFloat(arrumado).toFixed(2).replace('.',',');
	console.log('yyyyyyyyyyyyyyyy' + arrumado);

	return arrumado;
}


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

			var capital = POST.valor_minimo;
			console.log('capital:' + capital);

			for(i=0;i < data_relatorio[0].estrategias.length; i++){
				var net_profit = ((formCurrency.format(data_relatorio[0].estrategias[i].net_profit * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].net_profit_exib_reais = net_profit;
				data_relatorio[0].estrategias[i].net_profit_exib_perc = transformar_porcentagem(data_relatorio[0].estrategias[i].net_profit,data_robo[0].multiplicador,capital);

				var drawdown = ((formCurrency.format(data_relatorio[0].estrategias[i].drawdown * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].drawdown_exib_reais = drawdown;
				data_relatorio[0].estrategias[i].drawdown_exib_perc = transformar_porcentagem(data_relatorio[0].estrategias[i].drawdown,data_robo[0].multiplicador,capital);

				var average_trade = ((formCurrency.format(data_relatorio[0].estrategias[i].average_trade * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].average_trade_exib_reais = average_trade;
				data_relatorio[0].estrategias[i].average_trade_exib_perc = transformar_porcentagem(data_relatorio[0].estrategias[i].average_trade,data_robo[0].multiplicador,capital);

				var year_average = ((formCurrency.format(data_relatorio[0].estrategias[i].year_average * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].year_average_exib_reais = year_average;
				data_relatorio[0].estrategias[i].year_average_exib_perc = transformar_porcentagem(data_relatorio[0].estrategias[i].year_average,data_robo[0].multiplicador,capital);

				var daily_profit = ((formCurrency.format(data_relatorio[0].estrategias[i].daily_profit * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].daily_profit_exib_reais = daily_profit;
				data_relatorio[0].estrategias[i].daily_profit_exib_perc = transformar_porcentagem(data_relatorio[0].estrategias[i].daily_profit,data_robo[0].multiplicador,capital);


				var month_profit = ((formCurrency.format(data_relatorio[0].estrategias[i].month_profit * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].month_profit_exib_reais = month_profit;
				data_relatorio[0].estrategias[i].month_profit_exib_perc = transformar_porcentagem(data_relatorio[0].estrategias[i].month_profit,data_robo[0].multiplicador,capital);


				var average_trade = ((formCurrency.format(data_relatorio[0].estrategias[i].average_trade * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].average_trade_exib = average_trade;
				data_relatorio[0].estrategias[i].average_trade_perc = transformar_porcentagem(data_relatorio[0].estrategias[i].average_trade,data_robo[0].multiplicador,capital);
			}

			for(i=0;i < data_relatorio[0].resume_performance.length; i++){
				var net_profit = ((formCurrency.format(data_relatorio[0].resume_performance[i].net_profit * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].resume_performance[i].net_profit_exib_reais = net_profit;
				data_relatorio[0].resume_performance[i].net_profit_exib_perc = transformar_porcentagem(data_relatorio[0].resume_performance[i].net_profit,data_robo[0].multiplicador,capital);

			}

			for(i=0;i < data_relatorio[0].monthly_performance.length; i++){

				var jan = ((formCurrency.format(data_relatorio[0].monthly_performance[i].jan * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].jan_exib_reais = jan;
				data_relatorio[0].monthly_performance[i].jan_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].jan,data_robo[0].multiplicador,capital);

				var fev = ((formCurrency.format(data_relatorio[0].monthly_performance[i].fev * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].fev_exib_reais = fev;
				data_relatorio[0].monthly_performance[i].fev_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].fev,data_robo[0].multiplicador,capital);

				var mar = ((formCurrency.format(data_relatorio[0].monthly_performance[i].mar * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].mar_exib_reais = mar;
				data_relatorio[0].monthly_performance[i].mar_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].mar,data_robo[0].multiplicador,capital);

				var apr = ((formCurrency.format(data_relatorio[0].monthly_performance[i].apr * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].apr_exib_reais = apr;
				data_relatorio[0].monthly_performance[i].apr_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].apr,data_robo[0].multiplicador,capital);

				var may = ((formCurrency.format(data_relatorio[0].monthly_performance[i].may * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].may_exib_reais = may;
				data_relatorio[0].monthly_performance[i].may_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].may,data_robo[0].multiplicador,capital);


				var jun = ((formCurrency.format(data_relatorio[0].monthly_performance[i].jun * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].jun_exib_reais = jun;
				data_relatorio[0].monthly_performance[i].jun_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].jun,data_robo[0].multiplicador,capital);


				var jul = ((formCurrency.format(data_relatorio[0].monthly_performance[i].jul * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].jul_exib_reais = jul;
				data_relatorio[0].monthly_performance[i].jul_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].jul,data_robo[0].multiplicador,capital);


				var aug = ((formCurrency.format(data_relatorio[0].monthly_performance[i].aug * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].aug_exib_reais = aug;
				data_relatorio[0].monthly_performance[i].aug_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].aug,data_robo[0].multiplicador,capital);


				var sep = ((formCurrency.format(data_relatorio[0].monthly_performance[i].sep * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].sep_exib_reais = sep;
				data_relatorio[0].monthly_performance[i].sep_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].sep,data_robo[0].multiplicador,capital);


				var oct = ((formCurrency.format(data_relatorio[0].monthly_performance[i].oct * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].oct_exib_reais = oct;
				data_relatorio[0].monthly_performance[i].oct_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].oct,data_robo[0].multiplicador,capital);


				var nov = ((formCurrency.format(data_relatorio[0].monthly_performance[i].nov * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].nov_exib_reais = nov;
				data_relatorio[0].monthly_performance[i].nov_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].nov,data_robo[0].multiplicador,capital);


				var dec = ((formCurrency.format(data_relatorio[0].monthly_performance[i].dec * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].dec_exib_reais = dec;
				data_relatorio[0].monthly_performance[i].dec_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].dec,data_robo[0].multiplicador,capital);


				var ytd = ((formCurrency.format(data_relatorio[0].monthly_performance[i].ytd * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].ytd_exib_reais = ytd;
				data_relatorio[0].monthly_performance[i].ytd_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].ytd,data_robo[0].multiplicador,capital);

			}

			for(i=0;i < data_relatorio[0].stats.length; i++){
				var deviation = ((formCurrency.format(data_relatorio[0].stats[i].deviation * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].stats[i].deviation_exib_reais = deviation;
				data_relatorio[0].stats[i].deviation_exib_perc = transformar_porcentagem(data_relatorio[0].stats[i].deviation,data_robo[0].multiplicador,capital);

			}

			for(i=0;i < data_relatorio[0].trades.length; i++){
				var gross_profit = ((formCurrency.format(data_relatorio[0].trades[i].gross_profit * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].trades[i].gross_profit_exib_reais = gross_profit;
				data_relatorio[0].trades[i].gross_profit_exib_perc = transformar_porcentagem(data_relatorio[0].trades[i].gross_profit,data_robo[0].multiplicador,capital);

				var gross_loss = ((formCurrency.format(data_relatorio[0].trades[i].gross_loss * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].trades[i].gross_loss_exib_reais = gross_loss;
				data_relatorio[0].trades[i].gross_loss_exib_perc = transformar_porcentagem(data_relatorio[0].trades[i].gross_loss,data_robo[0].multiplicador,capital);

				var average_win = ((formCurrency.format(data_relatorio[0].trades[i].average_win * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].trades[i].average_win_exib_reais = average_win;
				data_relatorio[0].trades[i].average_win_exib_perc = transformar_porcentagem(data_relatorio[0].trades[i].average_win,data_robo[0].multiplicador,capital);

				var average_loss = ((formCurrency.format(data_relatorio[0].trades[i].average_loss * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].trades[i].average_loss_exib_reais = average_loss;
				data_relatorio[0].trades[i].average_loss_exib_perc = transformar_porcentagem(data_relatorio[0].trades[i].average_loss,data_robo[0].multiplicador,capital);

				var largest_win = ((formCurrency.format(data_relatorio[0].trades[i].largest_win * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].trades[i].largest_win_exib_reais = largest_win;
				data_relatorio[0].trades[i].largest_win_exib_perc = transformar_porcentagem(data_relatorio[0].trades[i].largest_win,data_robo[0].multiplicador,capital);

				var largest_loss = ((formCurrency.format(data_relatorio[0].trades[i].largest_loss * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].trades[i].largest_loss_exib_reais = largest_loss;
				data_relatorio[0].trades[i].largest_loss_exib_perc = transformar_porcentagem(data_relatorio[0].trades[i].largest_loss,data_robo[0].multiplicador,capital);



			}


			data[req.session.usuario.id+'_relatorio']= data_relatorio;


			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'relatorios/gerador_relatorio', data: data, usuario: req.session.usuario});
			

		}).sort({'_id':-1}).limit(1);
});






});








module.exports = router;
