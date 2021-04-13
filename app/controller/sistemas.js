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

const relatorioModel = require('../model/relatorioModel.js');

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


router.get('/', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 13;

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

			usuarioParametrosAlgoritmoModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),deletado:false},function(err,data_parametros_usuario){
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

						data[req.session.usuario.id+'_input_range_inicio']= 1200000;

						console.log('wwwwwwwwwwwwwwwwwwwww');
						console.log(data);
						console.log('wwwwwwwwwwwwwwwwwwwww');

						res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'sistemas/sistemas', data: data, usuario: req.session.usuario});
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


router.get('/relatorio/:algoritmo/:capital', function(req, res, next) {

	console.log('estou no relatorio');

	var algoritmo = req.params.algoritmo;
	var capital = req.params.capital;

	console.log('algoritmo:' + algoritmo);
	console.log('capital:' + capital);

	var porc_reais = 'porc';




	roboModel.find({'valor':algoritmo},function(err,data_robo){

		console.log('------------- data_robo----------------');
		console.log(data_robo);
		console.log('---------------------------------------');

		relatorioModel.find({},function(err,data_relatorio){

			console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrr data_relatorio rrrrrrrrrrrrrrrrrrrrrrrrrrrr');
			console.log(data_relatorio);
			console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');

			console.log('estrategias');
			console.log(data_relatorio[0].estrategias);

			var capital = req.params.capital;
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

			data[req.session.usuario.id+'_porc_reais'] = porc_reais;


			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'simulador/simulador_open', data: data, usuario: req.session.usuario});
			

		}).sort({'_id':-1}).limit(1);
});





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