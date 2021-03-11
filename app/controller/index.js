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

router.get('/', function(req, res, next) {
	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 1;
	console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
	console.log('req.session.usuario.nivel: ' + req.session.usuario.nivel);
	console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');

	if(req.session.usuario.nivel >= 3){
		usuarioCorretoraModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_corretora){
			data[req.session.usuario.id+'_usuario_corretora']= data_usuario_corretora;
			console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
			console.log(data);
			console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');

			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'inicio/index',  data: data, usuario: req.session.usuario});
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