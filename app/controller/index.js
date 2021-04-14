// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));

//var io = require("socket.io-client");

const mongoose = require('mongoose');

const log = require('../model/logModel.js');

var usuariosModel = require('../model/usuariosModel.js');
var usuarioCorretoraModel = require('../model/usuarioCorretoraModel.js');
var usuarioAlgoritmoHistoricoModel = require('../model/usuarioAlgoritmoHistoricoModel.js');
var usuarioRoboModel = require('../model/usuarioRoboModel.js');
var regrasAlgoritmoModel = require('../model/regrasAlgoritmoModel.js');

var usuarioParametrosAlgoritmoModel = require('../model/usuarioParametrosAlgoritmoModel');


var usuarioStatusModel = require('../model/usuarioStatusModel.js');
var moment = require('moment');
moment.locale('pt-br');

const formCurrency = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2
});



router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 1;
	console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
	console.log('req.session.usuario.nivel: ' + req.session.usuario.nivel);
	console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');

	console.log('estou no login');
	console.log(req.session.usuario);

	if(req.session.usuario.nivel >= 3){
		usuarioCorretoraModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_corretora){
			data[req.session.usuario.id+'_usuario_corretora']= data_usuario_corretora;
			console.log(data_usuario_corretora);

			usuarioParametrosAlgoritmoModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_parametros_usuario){
				data[req.session.usuario.id+'_usuario_parametros'] = data_parametros_usuario;

				regrasAlgoritmoModel.find({},function(err,data_regras_algoritmo){
					var data_atualizacao_r = data_regras_algoritmo[0].data_cadastro;
					var dataFormatada_r = moment(data_atualizacao_r).utc().format('DD/MM/YYYY');
					data[req.session.usuario.id+'_header_data_atualizada'] = dataFormatada_r;

					console.log('dataFormatada_r: ' + dataFormatada_r);


					usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){

						var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
						var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');
						data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;
						data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;



						usuarioAlgoritmoHistoricoModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_algoritmo_historico){


							var data_header_grafico = {}



							if(data_usuario_algoritmo_historico.length > 0 ){

								var melhor,pior;
								var meses_positivos = 0;
								var meses_negativos = 0;
								var numero_operacoes_t = 0;

								for(i=0;i < data_usuario_algoritmo_historico.length; i++){

									if(melhor == undefined){
										melhor = data_usuario_algoritmo_historico[i].porcentagem;
									}

									if(pior == undefined){
										pior = data_usuario_algoritmo_historico[i].porcentagem;
									}

									if(data_usuario_algoritmo_historico[i].porcentagem > melhor){
										melhor = data_usuario_algoritmo_historico[i].porcentagem;
									}

									if(data_usuario_algoritmo_historico[i].porcentagem < pior){
										pior = data_usuario_algoritmo_historico[i].porcentagem;
									}

									if(data_usuario_algoritmo_historico[i].porcentagem>0){
										meses_positivos++;
									}

									if(data_usuario_algoritmo_historico[i].porcentagem < 0){
										meses_negativos++;
									}

									numero_operacoes_t = numero_operacoes_t + data_usuario_algoritmo_historico[i].numero_operacoes;


								}

								var melhor_exib = melhor.toString().replace('.',',');
								var pior_exib = pior.toString().replace('.',',');

								data_header_grafico = {melhor:melhor,melhor_exib:melhor_exib,pior:pior,pior_exib:pior_exib,meses_positivos:meses_positivos,meses_negativos:meses_negativos,numero_operacoes:numero_operacoes_t};





							}else{
								data_header_grafico = {melhor:0,melhor_exib:0,pior:0,pior_exib:0,meses_positivos:0,meses_negativos:0,numero_operacoes:0};
							}

							data[req.session.usuario.id+'_usuario_grafico_header'] = data_header_grafico;
							usuarioAlgoritmoHistoricoModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_algoritmo_historico_3meses){

								console.log('data_usuario_algoritmo_historico_3meses');
								console.log(data_usuario_algoritmo_historico_3meses);

								data[req.session.usuario.id+'_usuario_grafico']= data_usuario_algoritmo_historico_3meses;

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

									console.log('ggggggggggggggggggggggggggggggggggg');
									console.log(data_algoritmo);
									console.log('ggggggggggggggggggggggggggggggggggg');

									console.log(data_algoritmo[0].algoritmo[0].nome);

									var preco_robo = formCurrency.format(data_algoritmo[0].algoritmo[0].preco);


									data_algoritmo[0].algoritmo[0].preco_exib = preco_robo;



									// console.log('ggggggggggg data_algoritmo[0] gggggggggggggg');
									// console.log(data_algoritmo[0]);


									data_algoritmo[0].rentabilidade_aa_exib = data_algoritmo[0].rentabilidade_aa.toString().replace('.',',');



									// console.log('preco_robo: ' + preco_robo);

									// console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
									// console.log(data);
									// console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');


									


									data[req.session.usuario.id+'_usuario_algoritmo'] = data_algoritmo;

									req.session.destroy(function(err) {
										console.log(err);
									});

									res.redirect('/');
									//res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/index',  data: data, usuario: req.session.usuario});
								});
							}).sort({'_id':-1}).limit(3);
						});
					}).sort({'_id':-1}).limit(1);
});
}).sort({'_id':-1}).limit(1);
}).sort({'_id':-1}).limit(1);


}else if(req.session.usuario.nivel == 2){
	usuariosModel.find({id_parceiro:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuarios){
		data[req.session.usuario.id+'_usuarios']= data_usuarios;
		console.log('-----------parceiro usuarios--------------------------------');
		console.log(data_usuarios);
		console.log('------------------------------------------------------------');

		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/indexParceiro',  data: data, usuario: req.session.usuario});

	});



}else if(req.session.usuario.nivel == 1){

	usuariosModel.aggregate([
	{
		$match:{nivel:{$gt:1},deletado:false}
	},
	{
		$lookup:{
			from:'usuarios',
			localField:'id_parceiro',
			foreignField:'_id',
			as:'parceiro'

		}
	},
	{
		$lookup:{
			from:'usuario_corretora',
			localField:'_id',
			foreignField:'id_usuario',
			as:'corretora'
		}

	}
	]).exec(function(err,data_usuarios){

		console.log('aaaaaaaaaaaaaaaaaaaaaaaaa administracao aaaaaaaaaaaaaaaaaaaaaa');
		console.log(data_usuarios);
		console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
		data[req.session.usuario.id+'_usuarios']= data_usuarios;
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/administracao',  data: data, usuario: req.session.usuario});

	});
}
});



router.post('/log', function(req, res, next) {
	POST = req.body;

	const new_log = new log({ 
		id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
		ip: POST[0], 
		method:POST[1],
		rota:POST[2],
		user_agent:POST[3],
		deletado:0,
		data_cadastro: new Date()
	});

	new_log.save(function (err) {
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}
	});

});


router.post('/aceitar_termos_popup', function(req, res, next) {
	POST = req.body;

	console.log('estou no aceitar termos popup');

	usuarioStatusModel.findOneAndUpdate({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},{'$set':{'aceite_termos_inicio':true}},function(err){
		res.json(data);
	});


});




router.post('/adicionar_usuario_corretora', function(req, res, next) {
	POST = req.body;

	console.log('--------------------');
	console.log(POST);
	console.log('--------------------');

	const usuarioCorretora = new usuarioCorretoraModel({ 
		id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
		email: POST.email, 
		senha:POST.senha,
		validado:false,
		testado:false,
		deletado:false,
		data_cadastro: new Date()
	});

	console.log('ccccccccccccccccc');
	console.log(usuarioCorretora);
	console.log('ccccccccccccccccc');

	usuarioCorretora.save(function (err) {
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}
	});

});





module.exports = router;