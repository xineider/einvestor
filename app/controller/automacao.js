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

const regrasAlgoritimoModel = require('../model/regrasAlgoritimoModel.js');

const formCurrency = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2
});


router.get('/', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 2;
	roboModel.find({},function(err,data_robo_t){
		data[req.session.usuario.id+'_robo_t']= data_robo_t;

		console.log('wwwwwwwwwwwwwwwwwwwww');
		console.log(data);
		console.log('wwwwwwwwwwwwwwwwwwwww');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'automacao/white_box', data: data, usuario: req.session.usuario});
	});
});





module.exports = router;