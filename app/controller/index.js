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

var licencaModel = require('../model/licencaModel.js');


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

		usuariosModel.find({_id:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario){
			data[req.session.usuario.id+'_usuario']= data_usuario;

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

							var valor_aplicado_u = data_usuario_status[0].valor_aplicado;
							var valor_aplicado_uf = valor_aplicado_u.toLocaleString('pt-br', {minimumFractionDigits: 2});
							data_usuario_status[0].valor_aplicado_f = valor_aplicado_uf;

							data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;

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
								console.log(data_algoritmo[0]);
								console.log('ggggggggggggggggggggggggggggggggggg');

								console.log(data_algoritmo[0].algoritmo[0].nome);

								var preco_robo = formCurrency.format(data_algoritmo[0].algoritmo[0].preco);

								data_algoritmo[0].algoritmo[0].preco_exib = preco_robo;
								data_algoritmo[0].rentabilidade_aa_exib = data_algoritmo[0].rentabilidade_aa.toString().replace('.',',');

								data[req.session.usuario.id+'_usuario_algoritmo'] = data_algoritmo;

								licencaModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_licenca){


									var data_agora = new Date();
									var data_fim_licenca = data_licenca[0].data_fim;

									const diferenca_tempo = data_fim_licenca - data_agora;
									const diferenca_dias = Math.ceil(diferenca_tempo / (1000 * 60 * 60 * 24));

									data_licenca[0].diferenca_dias = diferenca_dias;


									data[req.session.usuario.id+'_usuario_licenca'] = data_licenca;

									console.log('ddddddddddddddddddddddd');
									console.log(data);
									console.log('ddddddddddddddddddddddd');

									res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/index',  data: data, usuario: req.session.usuario});
								}).sort({'_id':-1}).limit(1);


							});
						}).sort({'_id':-1}).limit(1);
					});
				}).sort({'_id':-1}).limit(1);
			}).sort({'_id':-1}).limit(1);

		});


	}else if(req.session.usuario.nivel == 1){

		usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){

			console.log('-------------------------------');
			console.log(data_usuario_status);
			console.log('----------- administracao ------')

			if(data_usuario_status.length > 0 ){
				var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
				var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');
				data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;
			}

			data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;


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

			},
			{
				$lookup:{
					from:'usuario_status',
					localField:'_id',
					foreignField:'id_usuario',
					as:'status'
				}
			},
			{
				$lookup:{
					from:'usuario_parametros_algoritmo',
					localField:'_id',
					foreignField:'id_usuario',
					as:'parametros_algoritmo'
				}

			}
			]).exec(function(err,data_usuarios){

				console.log('aaaaaaaaaaaaaaaaaaaaaaaaa administracao aaaaaaaaaaaaaaaaaaaaaa');
				console.log(data_usuarios);
				console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
				data[req.session.usuario.id+'_usuarios']= data_usuarios;
				res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/status_usuarios',  data: data, usuario: req.session.usuario});

			});
		}).sort({'_id':-1}).limit(1);
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