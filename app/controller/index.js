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
var usuarioAlgoritmoModel = require('../model/usuarioAlgoritmoModel.js');
var usuariosDadosModel = require('../model/usuarioDadosModel.js');
var regrasAlgoritmoModel = require('../model/regrasAlgoritmoModel.js');

router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 1;
	console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
	console.log('req.session.usuario.nivel: ' + req.session.usuario.nivel);
	console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');

	if(req.session.usuario.nivel >= 3){
		usuarioCorretoraModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_corretora){
			data[req.session.usuario.id+'_usuario_corretora']= data_usuario_corretora;
			console.log(data_usuario_corretora);

			regrasAlgoritmoModel.find({},function(err,data_regras_algoritmo){
				var data_atualizacao = data_regras_algoritmo[0].data_cadastro;
				var dataFormatada = ("0" + data_atualizacao.getDate()).substr(-2) + "/" + ("0" + (data_atualizacao.getMonth() + 1)).substr(-2) + "/" + data_atualizacao.getFullYear();
				data[req.session.usuario.id+'_header_data_atualizada'] = dataFormatada;

				console.log('dataFormatada: ' + dataFormatada);


				usuariosDadosModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_dados){
					data[req.session.usuario.id+'_usuario_dados'] = data_usuario_dados;



					usuarioAlgoritmoModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_algoritmo){
						console.log('00000000000000000000000000000000000');
						console.log(data_usuario_algoritmo);
						console.log('00000000000000000000000000000000000');

						var data_header_grafico = {}

						console.log('data_usuario_algoritmo.length: ' + data_usuario_algoritmo.length);


						if(data_usuario_algoritmo.length > 0 ){

							var melhor,pior;
							var meses_positivos = 0;
							var meses_negativos = 0;

							for(i=0;i < data_usuario_algoritmo.length; i++){

								if(melhor == undefined){
									melhor = data_usuario_algoritmo[i].porcentagem;
								}

								if(pior == undefined){
									pior = data_usuario_algoritmo[i].porcentagem;
								}

								if(data_usuario_algoritmo[i].porcentagem > melhor){
									melhor = data_usuario_algoritmo[i].porcentagem;
								}

								if(data_usuario_algoritmo[i].porcentagem < pior){
									pior = data_usuario_algoritmo[i].porcentagem;
								}

								if(data_usuario_algoritmo[i].porcentagem>0){
									meses_positivos++;
								}

								if(data_usuario_algoritmo[i].porcentagem < 0){
									meses_negativos++;
								}


							}

							var melhor_exib = melhor.toString().replace('.',',');
							var pior_exib = pior.toString().replace('.',',');

							data_header_grafico = {melhor:melhor,melhor_exib:melhor_exib,pior:pior,pior_exib:pior_exib,meses_positivos:meses_positivos,meses_negativos:meses_negativos,numero_operacoes:data_usuario_dados[0].numero_operacoes};


							console.log('data_header_grafico');
							console.log(data_header_grafico);


						}else{
							data_header_grafico = {melhor:0,melhor_exib:0,pior:0,pior_exib:0,meses_positivos:0,meses_negativos:0,numero_operacoes:0};
						}

						data[req.session.usuario.id+'_usuario_grafico']= data_usuario_algoritmo;
						data[req.session.usuario.id+'_usuario_grafico_header'] = data_header_grafico;

						console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
						console.log(data);
						console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');

						res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/index',  data: data, usuario: req.session.usuario});
					}).sort({'_id':-1}).limit(3);
				})

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