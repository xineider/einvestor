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

var usuarioRoboModel = require('../model/usuarioRoboModel.js');

const roboModel = require('../model/roboModel.js');

const relatorioModel = require('../model/relatorioModel.js');

const regrasAlgoritmoModel = require('../model/regrasAlgoritmoModel.js');

const formCurrency = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2
});

function transformar_porcentagem(valor,robo,capital){
	// console.log('transformar_porcentagem');
	// console.log('valor: ' + valor);
	// console.log('robo: ' + robo);
	// console.log('capital: ' + capital);

	var arrumado = valor * robo / capital * 100;
	arrumado = parseFloat(arrumado).toFixed(2).replace('.',',');
	// console.log('yyyyyyyyyyyyyyyy' + arrumado);

	return arrumado;
}

var usuarioStatusModel = require('../model/usuarioStatusModel.js');
var moment = require('moment');
moment.locale('pt-br');



router.get('/', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 8;

	usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){

		var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
		var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');
		data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;
		data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;

		roboModel.find({},function(err,data_robo_t){
			data[req.session.usuario.id+'_robo_t']= data_robo_t;

			for(i=0;i < data_robo_t.length; i++){
				var valor_minimo_a = parseFloat(data_robo_t[i].valor_minimo);
				var valor_minimo_af = valor_minimo_a.toLocaleString('pt-br', {minimumFractionDigits: 2});

				console.log('valor_minimo_af:');
				console.log(valor_minimo_af);


				var valor_minimo_robo = formCurrency.format(data_robo_t[i].valor_minimo);
				// valor_minimo_robo = ((valor_minimo_robo.replace('.','#')).replace(',','.')).replace('#',',');
				console.log('valor_minimo_robo');
				console.log(valor_minimo_robo);
				data_robo_t[i].valor_minimo_robo = valor_minimo_af;
			}

			console.log('wwwwwwwwwwwwwwwwwwwww');
			console.log(data);
			console.log('wwwwwwwwwwwwwwwwwwwww');



			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'simulador/simulador', data: data, usuario: req.session.usuario});
		});

	}).sort({'_id':-1}).limit(1);


});
















router.post('/select_nome_algoritmo', function(req, res, next) {
	POST = req.body;
	console.log('estou alterando o table price selector ');
	console.log(POST);
	console.log('ttttttttttttttttttttttttttttttttttttttttt');

	var valor_minimo = 0;

	if(POST.valor != ''){
		var valor_minimo_p = POST.valor;
		console.log('valor_minimo_p:' + valor_minimo_p);
		var valor_minimo_f = valor_minimo_p.replace(/\./g,'');
		console.log('valor_minimo_f: ' + valor_minimo_f);
		valor_minimo = parseInt(valor_minimo_f);
	}else{
		valor_minimo = parseInt(POST.valor_minimo);
	}


	console.log('valor_minimo: ' + valor_minimo);

	roboModel.find({valor_minimo:{$lte:valor_minimo}},function(err,data_robo){

		data[req.session.usuario.id+'_robo']= data_robo;

		console.log('nnnnnnnnnnnnn select nome robo nnnnnnnnnnnnnnn');
		console.log(data);
		console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');

		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'simulador/nomes_algoritmo', data: data, usuario: req.session.usuario});

	});

});


router.post('/gerar_relatorio_algoritmo', function(req, res, next) {
	POST = req.body;
	console.log('estou alterando o gerar relatorio robo ');
	console.log(POST);
	console.log('ttttttttttttttttttttttttttttttttttttttttt');


	var x_multiplicador_x = POST.x_multiplicador;
	var x_multiplicador = 1;

	if(x_multiplicador_x <= 0 || x_multiplicador_x == ''){
		x_multiplicador = 1;
	}else{
		x_multiplicador = parseInt(x_multiplicador_x);
	}

	var porc_reais = 'porc';

	if(POST.reais != null){
		porc_reais = 'reais'
	}

	console.log('porc_reais: ' + porc_reais);

	console.log('x_multiplicador: ' + x_multiplicador);

	console.log('typeof POST.id_robo != undefined');
	console.log(typeof POST.id_robo != 'undefined');
	console.log(POST.id_robo == null);
	console.log(POST.id_robo == undefined);

	if(POST.id_robo != null){








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

				var capital = 0;

				if(POST.valor != ''){
					var valor_minimo_p = POST.valor;
					var valor_minimo_f = valor_minimo_p.replace(/\./g,'');
					capital = parseInt(valor_minimo_f);

				}else{
					capital = POST.valor_minimo;
				}
				console.log('capital:' + capital);

				for(i=0;i < data_relatorio[0].estrategias.length; i++){
					var net_profit = ((formCurrency.format(data_relatorio[0].estrategias[i].net_profit * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].estrategias[i].net_profit_exib_reais = net_profit;
					var net_profit_mult = data_relatorio[0].estrategias[i].net_profit * x_multiplicador;
					data_relatorio[0].estrategias[i].net_profit_exib_perc = transformar_porcentagem(net_profit_mult,data_robo[0].multiplicador,capital);

					var drawdown = ((formCurrency.format(data_relatorio[0].estrategias[i].drawdown * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].estrategias[i].drawdown_exib_reais = drawdown;
					var drawdon_mult = data_relatorio[0].estrategias[i].drawdown * x_multiplicador;
					data_relatorio[0].estrategias[i].drawdown_exib_perc = transformar_porcentagem(drawdon_mult,data_robo[0].multiplicador,capital);

					var average_trade = ((formCurrency.format(data_relatorio[0].estrategias[i].average_trade * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].estrategias[i].average_trade_exib_reais = average_trade;
					var average_trade_mult = data_relatorio[0].estrategias[i].average_trade * x_multiplicador;
					data_relatorio[0].estrategias[i].average_trade_exib_perc = transformar_porcentagem(average_trade_mult,data_robo[0].multiplicador,capital);

					var year_average = ((formCurrency.format(data_relatorio[0].estrategias[i].year_average * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].estrategias[i].year_average_exib_reais = year_average;
					var year_trade_mult = data_relatorio[0].estrategias[i].year_average * x_multiplicador;
					data_relatorio[0].estrategias[i].year_average_exib_perc = transformar_porcentagem(year_trade_mult,data_robo[0].multiplicador,capital);

					var daily_profit = ((formCurrency.format(data_relatorio[0].estrategias[i].daily_profit * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].estrategias[i].daily_profit_exib_reais = daily_profit;
					var daily_profit_mult = data_relatorio[0].estrategias[i].daily_profit * x_multiplicador;
					data_relatorio[0].estrategias[i].daily_profit_exib_perc = transformar_porcentagem(daily_profit_mult,data_robo[0].multiplicador,capital);


					var month_profit = ((formCurrency.format(data_relatorio[0].estrategias[i].month_profit * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].estrategias[i].month_profit_exib_reais = month_profit;
					var month_profit_mult = data_relatorio[0].estrategias[i].month_profit * x_multiplicador;
					data_relatorio[0].estrategias[i].month_profit_exib_perc = transformar_porcentagem(month_profit_mult,data_robo[0].multiplicador,capital);


					var average_trade = ((formCurrency.format(data_relatorio[0].estrategias[i].average_trade * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].estrategias[i].average_trade_exib = average_trade;
					var average_trade_mult = data_relatorio[0].estrategias[i].average_trade * x_multiplicador;
					data_relatorio[0].estrategias[i].average_trade_perc = transformar_porcentagem(average_trade_mult,data_robo[0].multiplicador,capital);
				}

				for(i=0;i < data_relatorio[0].resume_performance.length; i++){
					var net_profit = ((formCurrency.format(data_relatorio[0].resume_performance[i].net_profit * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].resume_performance[i].net_profit_exib_reais = net_profit;
					var net_profit_mult = data_relatorio[0].resume_performance[i].net_profit * x_multiplicador;
					data_relatorio[0].resume_performance[i].net_profit_exib_perc = transformar_porcentagem(net_profit_mult,data_robo[0].multiplicador,capital);

				}

				for(i=0;i < data_relatorio[0].monthly_performance.length; i++){

					var jan = ((formCurrency.format(data_relatorio[0].monthly_performance[i].jan * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].monthly_performance[i].jan_exib_reais = jan;
					var jan_mult = data_relatorio[0].monthly_performance[i].jan * x_multiplicador;
					data_relatorio[0].monthly_performance[i].jan_exib_perc = transformar_porcentagem(jan_mult,data_robo[0].multiplicador,capital);

					var fev = ((formCurrency.format(data_relatorio[0].monthly_performance[i].fev * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].monthly_performance[i].fev_exib_reais = fev;
					var fev_mult = data_relatorio[0].monthly_performance[i].fev * x_multiplicador;
					data_relatorio[0].monthly_performance[i].fev_exib_perc = transformar_porcentagem(fev_mult,data_robo[0].multiplicador,capital);

					var mar = ((formCurrency.format(data_relatorio[0].monthly_performance[i].mar * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].monthly_performance[i].mar_exib_reais = mar;
					var mar_mult = data_relatorio[0].monthly_performance[i].mar * x_multiplicador;
					data_relatorio[0].monthly_performance[i].mar_exib_perc = transformar_porcentagem(mar_mult,data_robo[0].multiplicador,capital);

					var apr = ((formCurrency.format(data_relatorio[0].monthly_performance[i].apr * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].monthly_performance[i].apr_exib_reais = apr;
					var apr_mult = data_relatorio[0].monthly_performance[i].apr * x_multiplicador;
					data_relatorio[0].monthly_performance[i].apr_exib_perc = transformar_porcentagem(apr_mult,data_robo[0].multiplicador,capital);

					var may = ((formCurrency.format(data_relatorio[0].monthly_performance[i].may * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].monthly_performance[i].may_exib_reais = may;
					var may_mult = data_relatorio[0].monthly_performance[i].may * x_multiplicador;
					data_relatorio[0].monthly_performance[i].may_exib_perc = transformar_porcentagem(may_mult,data_robo[0].multiplicador,capital);


					var jun = ((formCurrency.format(data_relatorio[0].monthly_performance[i].jun * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].monthly_performance[i].jun_exib_reais = jun;
					var jun_mult = data_relatorio[0].monthly_performance[i].jun * x_multiplicador;
					data_relatorio[0].monthly_performance[i].jun_exib_perc = transformar_porcentagem(jun_mult,data_robo[0].multiplicador,capital);


					var jul = ((formCurrency.format(data_relatorio[0].monthly_performance[i].jul * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].monthly_performance[i].jul_exib_reais = jul;
					var jul_mult = data_relatorio[0].monthly_performance[i].jul * x_multiplicador;
					data_relatorio[0].monthly_performance[i].jul_exib_perc = transformar_porcentagem(jul_mult,data_robo[0].multiplicador,capital);


					var aug = ((formCurrency.format(data_relatorio[0].monthly_performance[i].aug * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].monthly_performance[i].aug_exib_reais = aug;
					var aug_mult = data_relatorio[0].monthly_performance[i].aug * x_multiplicador;
					data_relatorio[0].monthly_performance[i].aug_exib_perc = transformar_porcentagem(aug_mult,data_robo[0].multiplicador,capital);


					var sep = ((formCurrency.format(data_relatorio[0].monthly_performance[i].sep * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].monthly_performance[i].sep_exib_reais = sep;
					var sep_mult = data_relatorio[0].monthly_performance[i].sep * x_multiplicador;
					data_relatorio[0].monthly_performance[i].sep_exib_perc = transformar_porcentagem(sep_mult,data_robo[0].multiplicador,capital);


					var oct = ((formCurrency.format(data_relatorio[0].monthly_performance[i].oct * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].monthly_performance[i].oct_exib_reais = oct;
					var oct_mult = data_relatorio[0].monthly_performance[i].oct * x_multiplicador;
					data_relatorio[0].monthly_performance[i].oct_exib_perc = transformar_porcentagem(oct_mult,data_robo[0].multiplicador,capital);


					var nov = ((formCurrency.format(data_relatorio[0].monthly_performance[i].nov * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].monthly_performance[i].nov_exib_reais = nov;
					var nov_mult = data_relatorio[0].monthly_performance[i].nov * x_multiplicador;
					data_relatorio[0].monthly_performance[i].nov_exib_perc = transformar_porcentagem(nov_mult,data_robo[0].multiplicador,capital);


					var dec = ((formCurrency.format(data_relatorio[0].monthly_performance[i].dec * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].monthly_performance[i].dec_exib_reais = dec;
					var dec_mult = data_relatorio[0].monthly_performance[i].dec * x_multiplicador;
					data_relatorio[0].monthly_performance[i].dec_exib_perc = transformar_porcentagem(dec_mult,data_robo[0].multiplicador,capital);


					var ytd = ((formCurrency.format(data_relatorio[0].monthly_performance[i].ytd * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].monthly_performance[i].ytd_exib_reais = ytd;
					var ytd_mult = data_relatorio[0].monthly_performance[i].ytd * x_multiplicador;
					data_relatorio[0].monthly_performance[i].ytd_exib_perc = transformar_porcentagem(ytd_mult,data_robo[0].multiplicador,capital);

				}

				for(i=0;i < data_relatorio[0].stats.length; i++){
					var deviation = ((formCurrency.format(data_relatorio[0].stats[i].deviation * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].stats[i].deviation_exib_reais = deviation;
					var deviation_mult = data_relatorio[0].stats[i].deviation * x_multiplicador;
					data_relatorio[0].stats[i].deviation_exib_perc = transformar_porcentagem(deviation_mult,data_robo[0].multiplicador,capital);

				}

				for(i=0;i < data_relatorio[0].trades.length; i++){
					var gross_profit = ((formCurrency.format(data_relatorio[0].trades[i].gross_profit * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].trades[i].gross_profit_exib_reais = gross_profit;
					var gross_profit_mult = data_relatorio[0].trades[i].gross_profit * x_multiplicador;
					data_relatorio[0].trades[i].gross_profit_exib_perc = transformar_porcentagem(gross_profit_mult,data_robo[0].multiplicador,capital);

					var gross_loss = ((formCurrency.format(data_relatorio[0].trades[i].gross_loss * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].trades[i].gross_loss_exib_reais = gross_loss;
					var gross_loss_mult = data_relatorio[0].trades[i].gross_loss * x_multiplicador;
					data_relatorio[0].trades[i].gross_loss_exib_perc = transformar_porcentagem(gross_loss_mult,data_robo[0].multiplicador,capital);

					var average_win = ((formCurrency.format(data_relatorio[0].trades[i].average_win * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].trades[i].average_win_exib_reais = average_win;
					var average_win_mult = data_relatorio[0].trades[i].average_win * x_multiplicador;
					data_relatorio[0].trades[i].average_win_exib_perc = transformar_porcentagem(average_win_mult,data_robo[0].multiplicador,capital);

					var average_loss = ((formCurrency.format(data_relatorio[0].trades[i].average_loss * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].trades[i].average_loss_exib_reais = average_loss;
					var average_loss_mult = data_relatorio[0].trades[i].average_loss * x_multiplicador;
					data_relatorio[0].trades[i].average_loss_exib_perc = transformar_porcentagem(average_loss_mult,data_robo[0].multiplicador,capital);

					var largest_win = ((formCurrency.format(data_relatorio[0].trades[i].largest_win * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].trades[i].largest_win_exib_reais = largest_win;
					var largest_win_mult = data_relatorio[0].trades[i].largest_win * x_multiplicador;
					data_relatorio[0].trades[i].largest_win_exib_perc = transformar_porcentagem(largest_win_mult,data_robo[0].multiplicador,capital);

					var largest_loss = ((formCurrency.format(data_relatorio[0].trades[i].largest_loss * data_robo[0].multiplicador * x_multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
					data_relatorio[0].trades[i].largest_loss_exib_reais = largest_loss;
					var largest_loss_mult = data_relatorio[0].trades[i].largest_loss * x_multiplicador;
					data_relatorio[0].trades[i].largest_loss_exib_perc = transformar_porcentagem(largest_loss_mult,data_robo[0].multiplicador,capital);



				}


				data[req.session.usuario.id+'_relatorio']= data_relatorio;

				data[req.session.usuario.id+'_porc_reais'] = porc_reais;

				res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'relatorio/gerador_relatorio', data: data, usuario: req.session.usuario});


			}).sort({'_id':-1}).limit(1);

});

}else{
	console.log('cai aqui no erro');
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'simulador/erro_simulador', data: data, usuario: req.session.usuario});
}








});








module.exports = router;
