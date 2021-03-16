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





router.get('/', function(req, res, next) {

	data.link_sistema = '/sistema';
	data[req.session.usuario.id+'_numero_menu'] = 11;

	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'suporte/faq', data: data, usuario: req.session.usuario});
	
});





module.exports = router;
