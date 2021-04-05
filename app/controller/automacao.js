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

var parametrosSelectModel = require('../model/parametrosAlgoritmoSelectModel');

var usuarioParametrosAlgoritmoModel = require('../model/usuarioParametrosAlgoritmoModel');

var usuarioCorretoraModel = require('../model/usuarioCorretoraModel.js');

var usuarioStatusModel = require('../model/usuarioStatusModel.js');
var moment = require('moment');
moment.locale('pt-br');


router.get('/', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 2;

	usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){

		var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
		var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');
		data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;
		data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;

		usuarioCorretoraModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),deletado:false},function(err,data_usuario_corretora){
			console.log('-------------------------');
			console.log(data_usuario_corretora);
			console.log('-------------------------');
			data[req.session.usuario.id+'_usuario_corretora'] = data_usuario_corretora;

			usuarioParametrosAlgoritmoModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),deletado:false},function(err,data_parametros_usuario){
				data[req.session.usuario.id+'_usuario_parametros'] = data_parametros_usuario;
				console.log('wwwwwwwwwwwwwwwwwwwww');
				console.log(data);
				console.log('wwwwwwwwwwwwwwwwwwwww');

				res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'automacao/conta', data: data, usuario: req.session.usuario});

			}).sort({'_id':-1}).limit(1);
		}).sort({'_id':-1}).limit(1);
	}).sort({'_id':-1}).limit(1);
});



router.get('/parametros', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 2;

	usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){
		
		var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
		var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');
		data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;

		data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;
		data[req.session.usuario.id+'_nome_estrategia'] = '';

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

			usuarioCorretoraModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),deletado:false},function(err,data_usuario_corretora){
				console.log('-------------------------');
				console.log(data_usuario_corretora);
				console.log('-------------------------');
				data[req.session.usuario.id+'_usuario_corretora'] = data_usuario_corretora;

				regrasAlgoritmoModel.find({},function(err,data_regras_algoritmo){
					var data_atualizacao_a = data_regras_algoritmo[0].data_cadastro;
					var data_atualizacao_af = moment(data_atualizacao_a).utc().format('DD/MM/YYYY');

					data[req.session.usuario.id+'_header_data_atualizada'] = data_atualizacao_af;

					parametrosSelectModel.find({},function(err,data_select_parametros){
						data[req.session.usuario.id+'_select_parametros'] = data_select_parametros;

						usuarioParametrosAlgoritmoModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),deletado:false},function(err,data_parametros_usuario){
							data[req.session.usuario.id+'_usuario_parametros'] = data_parametros_usuario;
							data[req.session.usuario.id+'_mensagem_carregado'] = false;


							console.log('wwwwwwwwwwwwwwwwwwwww');
							console.log(data);
							console.log('wwwwwwwwwwwwwwwwwwwww');
							res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'automacao/parametros', data: data, usuario: req.session.usuario});
						}).sort({'_id':-1}).limit(1);;
					}).sort({'_id':-1}).limit(1);
				}).sort({'_id':-1}).limit(1);
			}).sort({'_id':-1}).limit(1);


		});
	}).sort({'_id':-1}).limit(1);
});


router.get('/popup-carregar-conta-termos', function(req, res, next) {
	console.log('estou no carregar conta');
	
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'automacao/popup_carregar_conta_termos', data: data, usuario: req.session.usuario});

});

router.get('/popup-sincronizar-estrategia-termos', function(req, res, next) {

	console.log('estou no popup-sincronizar-estrategia-termos');
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'automacao/popup_sincronizar_estrategia_termos', data: data, usuario: req.session.usuario});
});


router.get('/popup-sincronizar-estrategia-propria', function(req, res, next) {

	console.log('estou no popup-sincronizar-estrategia-propria');
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'automacao/popup_sincronizar_estrategia_propria', data: data, usuario: req.session.usuario});
});



router.post('/adicionar_conta_usuario_corretora', function(req, res, next) {

	console.log('estou no adicionar_conta_usuario_corretora');

	POST = req.body;

	console.log('POST');
	console.log(POST);
	console.log('XXXXXXXXXXXXX');





	const usuarioCorretora = new usuarioCorretoraModel({ 
		id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
		email: POST.conta, 
		senha:POST.senha,
		corretora:POST.corretora,
		validado:false,
		sincronizado:false,
		deletado:false,
		data_cadastro: new Date()
	});

	console.log('ccccccccccc usuario Corretora cccccccccccc');
	console.log(usuarioCorretora);
	console.log('cccccccccccccccccccccccccccccccccccccccccc');

	usuarioCorretora.save(function (err) {
		if (err) {
			return handleError(err);
		}else{

			var nova_data = new Date();

			usuarioStatusModel.findOneAndUpdate({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},{'$set':{'conta':'Sincronizando','data_atualizacao':nova_data}},function(err){
				res.json(data);

			});
		}
	});

});






router.post('/carregar_parametros_algoritmo', function(req, res, next) {

	console.log('estou no carregar parametros algoritmo');

	POST = req.body;

	console.log('QQQQQQQQQQQQQQQQQQQQQQQQQQQQ POST QQQQQQQQQQQQQQQQQQQQ');
	console.log(POST);
	console.log('QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ');

	console.log('POST.nome_estrategia: ' + POST.nome_estrategia);


	data[req.session.usuario.id+'_nome_estrategia'] = POST.nome_estrategia;




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

		// console.log('lllllllllllll data algoritmo llllllllllllllll');
		// console.log(data_algoritmo);
		// console.log('lllllllllllllllllllllllllllllllllllllllllllll');


		// console.log('data_algoritmo.algoritmo[0].multiplicador: ' + data_algoritmo[0].algoritmo[0].multiplicador);



		parametrosAlgoritmoModel.find({},function(err,data_parametros){
			console.log('------------- data parametros ---------------------');
			console.log(data_parametros);
			console.log('---------------------------------------------------');
			multiplicador = data_algoritmo[0].algoritmo[0].multiplicador;


			data_parametros[0].max_op_lot_size_1_a = 3 * multiplicador;
			data_parametros[0].max_op_lot_size_2_a = 5 * multiplicador;

			data_parametros[0].a1_lot_size_1_a = multiplicador;
			data_parametros[0].a1_lot_size_2_a = multiplicador;

			data[req.session.usuario.id+'_usuario_parametros'] = data_parametros;

			data[req.session.usuario.id+'_mensagem_carregado'] = true;


			console.log('-------------------------------');
			console.log(data);
			console.log('-------------------------------');


			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'automacao/parametros_formulario', data: data, usuario: req.session.usuario});


		}).sort({'_id':-1}).limit(1);

	});
});


router.post('/sincronizar_estrategia_algoritmo', function(req, res, next) {

	console.log('estou no sincronizar_estrategia_algoritmo');

	POST = req.body;

	console.log('POST');
	console.log(POST);
	console.log('XXXXXXXXXXXXX');


	var tipo = 'padrao';
	var nova_data = new Date();


	const parametrosUsuario = new usuarioParametrosAlgoritmoModel({ 						
		id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
		tipo:tipo,
		setup_name:[POST.setup_name_value],
		symbol_name:[POST.symbol_name_value],
		symbol_hedge_name_2:[POST.symbol_hedge_name_2_value],
		magic_number:[POST.magic_number_value],
		max_op_lot_size_1:[POST.max_op_lot_size_1_value,POST.max_op_lot_size_1_start,POST.max_op_lot_size_1_step,POST.max_op_lot_size_1_stop,POST.max_op_lot_size_1_steps,'-'],
		max_op_lot_size_2:[POST.max_op_lot_size_2_value,POST.max_op_lot_size_2_start,POST.max_op_lot_size_2_step,POST.max_op_lot_size_2_stop,POST.max_op_lot_size_2_steps,'-'],
		number_1_id:[POST.number_1_id_value,POST.number_1_id_start,POST.number_1_id_step,POST.number_1_id_stop,POST.number_1_id_steps,'-'],
		number_2_id:[POST.number_2_id_value,POST.number_2_id_start,POST.number_2_id_step,POST.number_2_id_stop,POST.number_2_id_steps,'-'],
		a1_lot_size_1:[POST.a1_lot_size_1_value,POST.a1_lot_size_1_start,POST.a1_lot_size_1_step,POST.a1_lot_size_1_stop,POST.a1_lot_size_1_steps,'-'],
		a1_lot_size_2:[POST.a1_lot_size_2_value,POST.a1_lot_size_2_start,POST.a1_lot_size_2_step,POST.a1_lot_size_2_stop,POST.a1_lot_size_2_steps,'-'],
		a2_mode_1:[POST.a2_mode_1_value,POST.a2_mode_1_start,POST.a2_mode_1_step,POST.a2_mode_1_stop,POST.a2_mode_1_steps,'-'],
		a2_mode_2:[POST.a2_mode_2_value,POST.a2_mode_2_start,POST.a2_mode_2_step,POST.a2_mode_2_stop,POST.a2_mode_2_steps,'-'],
		b1_measure_1:[POST.b1_measure_1_value,POST.b1_measure_1_start,POST.b1_measure_1_step,POST.b1_measure_1_stop,POST.b1_measure_1_steps,'-'],
		b1_measure_2:[POST.b1_measure_2_value,POST.b1_measure_2_start,POST.b1_measure_2_step,POST.b1_measure_2_stop,POST.b1_measure_2_steps,'-'],
		b2_distance_1:[POST.b2_distance_1_value,POST.b2_distance_1_start,POST.b2_distance_1_step,POST.b2_distance_1_stop,POST.b2_distance_1_steps,POST.b2_distance_1_optimize],
		b2_distance_2:[POST.b2_distance_2_value,POST.b2_distance_2_start,POST.b2_distance_2_step,POST.b2_distance_2_stop,POST.b2_distance_2_steps,POST.b2_distance_2_optimize],
		c1_direction_1:[POST.c1_direction_1_value,POST.c1_direction_1_start,POST.c1_direction_1_step,POST.c1_direction_1_stop,POST.c1_direction_1_steps,POST.c1_direction_1_optimize],
		c1_direction_2:[POST.c1_direction_2_value,POST.c1_direction_2_start,POST.c1_direction_2_step,POST.c1_direction_2_stop,POST.c1_direction_2_steps,POST.c1_direction_2_optimize],
		c2_measure_1:[POST.c2_measure_1_value,POST.c2_measure_1_start,POST.c2_measure_1_step,POST.c2_measure_1_stop,POST.c2_measure_1_steps,'-'],
		c2_measure_2:[POST.c2_measure_2_value,POST.c2_measure_2_start,POST.c2_measure_2_step,POST.c2_measure_2_stop,POST.c2_measure_2_steps,'-'],
		c3_distance_1:[POST.c3_distance_1_value,POST.c3_distance_1_start,POST.c3_distance_1_step,POST.c3_distance_1_stop,POST.c3_distance_1_steps,'-'],
		c3_distance_2:[POST.c3_distance_2_value,POST.c3_distance_2_start,POST.c3_distance_2_step,POST.c3_distance_2_stop,POST.c3_distance_2_steps,POST.c3_distance_2_optimize],
		c4_size_1:[POST.c4_size_1_value,POST.c4_size_1_start,POST.c4_size_1_step,POST.c4_size_1_stop,POST.c4_size_1_steps,'-'],
		c4_size_2:[POST.c4_size_2_value,POST.c4_size_2_start,POST.c4_size_2_step,POST.c4_size_2_stop,POST.c4_size_2_steps,'-'],
		d1_measure_1:[POST.d1_measure_1_value,POST.d1_measure_1_start,POST.d1_measure_1_step,POST.d1_measure_1_stop,POST.d1_measure_1_steps,'-'],
		d1_measure_2:[POST.d1_measure_2_value,POST.d1_measure_2_start,POST.d1_measure_2_step,POST.d1_measure_2_stop,POST.d1_measure_2_steps,'-'],
		d2_distance_1:[POST.d2_distance_1_value,POST.d2_distance_1_start,POST.d2_distance_1_step,POST.d2_distance_1_stop,POST.d2_distance_1_steps,'-'],
		d2_distance_2:[POST.d2_distance_2_value,POST.d2_distance_2_start,POST.d2_distance_2_step,POST.d2_distance_2_stop,POST.d2_distance_2_steps,'-'],
		t1_time_1:[POST.t1_time_1_value,POST.t1_time_1_start,POST.t1_time_1_step,POST.t1_time_1_stop,POST.t1_time_1_steps,POST.t1_time_1_optimize],
		a1_action_1:[POST.a1_action_1_value,POST.a1_action_1_start,POST.a1_action_1_step,POST.a1_action_1_stop,POST.a1_action_1_steps,POST.a1_action_1_optimize],
		f1_filter_1:[POST.f1_filter_1_value,POST.f1_filter_1_start,POST.f1_filter_1_step,POST.f1_filter_1_stop,POST.f1_filter_1_steps,'-'],
		t2_time_1:[POST.t2_time_1_value,POST.t2_time_1_start,POST.t2_time_1_step,POST.t2_time_1_stop,POST.t2_time_1_steps,POST.t2_time_1_optimize],
		a2_action_1:[POST.a2_action_1_value,POST.a2_action_1_start,POST.a2_action_1_step,POST.a2_action_1_stop,POST.a2_action_1_steps,'-'],
		f2_filter_1:[POST.f2_filter_1_value,POST.f2_filter_1_start,POST.f2_filter_1_step,POST.f2_filter_1_stop,POST.f2_filter_1_steps,'-'],
		t3_time_1:[POST.t3_time_1_value,POST.t3_time_1_start,POST.t3_time_1_step,POST.t3_time_1_stop,POST.t3_time_1_steps,POST.t3_time_1_optimize],
		a3_action_1:[POST.a3_action_1_value,POST.a3_action_1_start,POST.a3_action_1_step,POST.a3_action_1_stop,POST.a3_action_1_steps,'-'],
		f3_filter_1:[POST.f3_filter_1_value,POST.f3_filter_1_start,POST.f3_filter_1_step,POST.f3_filter_1_stop,POST.f3_filter_1_steps,'-'],
		t4_time_2:[POST.t4_time_2_value,POST.t4_time_2_start,POST.t4_time_2_step,POST.t4_time_2_stop,POST.t4_time_2_steps,POST.t4_time_2_optimize],
		a4_action_2:[POST.a4_action_2_value,POST.a4_action_2_start,POST.a4_action_2_step,POST.a4_action_2_stop,POST.a4_action_2_steps,POST.a4_action_2_optimize],
		f4_filter_2:[POST.f4_filter_2_value,POST.f4_filter_2_start,POST.f4_filter_2_step,POST.f4_filter_2_stop,POST.f4_filter_2_steps,'-'],
		t5_time_2:[POST.t5_time_2_value,POST.t5_time_2_start,POST.t5_time_2_step,POST.t5_time_2_stop,POST.t5_time_2_steps,POST.t5_time_2_optimize],
		a5_action_2:[POST.a5_action_2_value,POST.a5_action_2_start,POST.a5_action_2_step,POST.a5_action_2_stop,POST.a5_action_2_steps,'-'],
		f5_filter_2:[POST.f5_filter_2_value,POST.f5_filter_2_start,POST.f5_filter_2_step,POST.f5_filter_2_stop,POST.f5_filter_2_steps,'-'],
		t6_time_2:[POST.t6_time_2_value,POST.t6_time_2_start,POST.t6_time_2_step,POST.t6_time_2_stop,POST.t6_time_2_steps,'-'],
		a6_action_2:[POST.a6_action_2_value,POST.a6_action_2_start,POST.a6_action_2_step,POST.a6_action_2_stop,POST.a6_action_2_steps,'-'],
		f6_filter_2:[POST.f6_filter_2_value,POST.f6_filter_2_start,POST.f6_filter_2_step,POST.f6_filter_2_stop,POST.f6_filter_2_steps,'-'],
		deletado:false,
		data_cadastro:nova_data
	});

	console.log('uuuuuuuuuuuuuuuuuu parametrosUsuario uuuuuuuuuuuuuuuuuuu');
	console.log(parametrosUsuario);
	console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');

	parametrosUsuario.save(function (err) {
		if (err) {
			return handleError(err);
		}else{

			var nova_data = new Date();

			usuarioStatusModel.findOneAndUpdate({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},{'$set':{'algoritmo':'Sincronizando','data_atualizacao':nova_data}},function(err){
				res.json(data);

			});



		}
	});








});




router.post('/sincronizar_estrategia_algoritmo_usuario', function(req, res, next) {

	console.log('estou no sincronizar_estrategia_algoritmo do usuario');

	POST = req.body;

	console.log('POST');
	console.log(POST);
	console.log('XXXXXXXXXXXXX');


	var tipo = 'usuario';


	const parametrosUsuario = new usuarioParametrosAlgoritmoModel({ 						
		id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
		tipo:tipo,
		setup_name:[POST.setup_name_value],
		symbol_name:[POST.symbol_name_value,POST.symbol_name_start,POST.symbol_name_step,POST.symbol_name_stop,POST.symbol_name_steps],
		deletado:false,
		data_cadastro:nova_data
	});

	console.log('uuuuuuuuuuuuuuuuuu parametrosUsuario uuuuuuuuuuuuuuuuuuu');
	console.log(parametrosUsuario);
	console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');

	// parametrosUsuario.save(function (err) {
	// 	if (err) {
	// 		return handleError(err);
	// 	}else{

	// 		var nova_data = new Date();

	// 		usuarioStatusModel.findOneAndUpdate({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},{'$set':{'algoritmo':'Sincronizando','data_atualizacao':nova_data}},function(err){
	// 			res.json(data);

	// 		});



	// 	}
	// });








});




module.exports = router;