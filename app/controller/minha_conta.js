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

var usuarioStatusModel = require('../model/usuarioStatusModel.js');
var moment = require('moment');
moment.locale('pt-br');

var usuarioCorretoraModel = require('../model/usuarioCorretoraModel.js');
var usuarioParametrosAlgoritmoModel = require('../model/usuarioParametrosAlgoritmoModel');

var licencaModel = require('../model/licencaModel.js');
var desativarContaModel = require('../model/desativarContaModel.js');

router.get('/', function(req, res, next) {

	data.link_sistema = '/sistema';
	data.numero_menu = 2;

	usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){

		var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
		var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');

		var valor_aplicado_u = data_usuario_status[0].valor_aplicado;
		var valor_aplicado_uf = valor_aplicado_u.toLocaleString('pt-br', {minimumFractionDigits: 2});

		data_usuario_status[0].valor_aplicado_f = valor_aplicado_uf;
		data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;
		data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;

		usuarioCorretoraModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_corretora){
			data[req.session.usuario.id+'_usuario_corretora']= data_usuario_corretora;

			usuarioParametrosAlgoritmoModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_parametros_usuario){
				data[req.session.usuario.id+'_usuario_parametros'] = data_parametros_usuario;

				licencaModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_licenca){

					console.log('data_licenca.length: ' + data_licenca.length);
					console.log(data_licenca.length > 0);
					if(data_licenca.length > 0){
						var data_fim_u = data_licenca[0].data_fim;
						var data_fim_uf = moment(data_fim_u).utc().format('DD');
						data_licenca[0].data_fim_uf = data_fim_uf;
					}

					data[req.session.usuario.id+'_usuario_licenca'] = data_licenca;

					usuarioModel.find({'_id':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_t){
						console.log('uuuuuuuu data_usuario uuuuuu');
						console.log(data_usuario_t);
						console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuu');

						data[req.session.usuario.id+'_usuario_t'] = data_usuario_t;

						desativarContaModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_desativar_conta){
							console.log('uuuuuuuu data_desativar_conta uuuuuu');
							console.log(data_desativar_conta);
							console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuu');

							data[req.session.usuario.id+'_usuario_desativar_conta'] = data_desativar_conta;


							console.log('minha conta');
							console.log(data);
							console.log('-----------------');



							res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'minha_conta/minha_conta', data: data, usuario: req.session.usuario});
						}).sort({'_id':-1}).limit(1);
					}).sort({'_id':-1}).limit(1);
				}).sort({'_id':-1}).limit(1);
			}).sort({'_id':-1}).limit(1);
		}).sort({'_id':-1}).limit(1);

	}).sort({'_id':-1}).limit(1);
});



router.get('/alterar-senha', function(req, res, next) {

	data.link_sistema = '/sistema';
	data.numero_menu = 2;

	usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){

		var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
		var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');

		var valor_aplicado_u = data_usuario_status[0].valor_aplicado;
		var valor_aplicado_uf = valor_aplicado_u.toLocaleString('pt-br', {minimumFractionDigits: 2});

		data_usuario_status[0].valor_aplicado_f = valor_aplicado_uf;
		data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;
		data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;

		usuarioCorretoraModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_corretora){
			data[req.session.usuario.id+'_usuario_corretora']= data_usuario_corretora;

			usuarioParametrosAlgoritmoModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_parametros_usuario){
				data[req.session.usuario.id+'_usuario_parametros'] = data_parametros_usuario;

				licencaModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_licenca){

					console.log('data_licenca.length: ' + data_licenca.length);
					console.log(data_licenca.length > 0);
					if(data_licenca.length > 0){
						var data_fim_u = data_licenca[0].data_fim;
						var data_fim_uf = moment(data_fim_u).utc().format('DD/MM/YYYY');
						data_licenca[0].data_fim_uf = data_fim_uf;
					}

					data[req.session.usuario.id+'_usuario_licenca'] = data_licenca;
					

					usuarioModel.find({'_id':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_t){
						console.log('uuuuuuuu data_usuario uuuuuu');
						console.log(data_usuario_t);
						console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuu');

						data[req.session.usuario.id+'_usuario_t'] = data_usuario_t;

						

						console.log('minha conta');
						console.log(data);
						console.log('-----------------');


						res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'minha_conta/alterar_senha', data: data, usuario: req.session.usuario});
						
					}).sort({'_id':-1}).limit(1);
				}).sort({'_id':-1}).limit(1);
			}).sort({'_id':-1}).limit(1);
		}).sort({'_id':-1}).limit(1);

	}).sort({'_id':-1}).limit(1);
});



router.get('/pop-up-desativar-conta', function(req, res, next) {
	console.log('pop-up-desativar-conta');
	
	res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'minha_conta/popup_desativar_conta', data: data, usuario: req.session.usuario});

});



router.post('/alterar-senha', function(req, res, next) {
	POST = req.body;

	console.log('JJJJJJJJJJJJJJJ ESTOU NO INICIAR alterar-senha JJJJJJJJJJJJJJJJJJJJJ');
	console.log(POST);
	console.log('JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ');

	if(POST.senha_atual != ''){
		if(POST.nova_senha != ''){
			if(POST.repetir_nova_senha != ''){



				var verificarSenhaAtual =  control.Encrypt(POST.senha_atual);

				console.log('------------------------- verificarSenhaAtual ---------');
				console.log(verificarSenhaAtual);
				console.log('--------------------------------------------------------');

				usuarioModel.findOne({'_id':mongoose.Types.ObjectId(req.session.usuario.id),'senha':verificarSenhaAtual},function(err,data_usuario){
					
					if(data_usuario != null){

						if(POST.nova_senha == POST.repetir_nova_senha){

							if(POST.nova_senha.length >= 6){

								var novaSenhaCriptografa = control.Encrypt(POST.nova_senha);

								usuarioModel.findOneAndUpdate({'_id':mongoose.Types.ObjectId(req.session.usuario.id)},{'$set':{'senha':novaSenhaCriptografa}},function(err){
									if (err) {
										return handleError(err);
									}else{
										res.json(data);
									}
								});
							}else{
								res.json({error:'nova_senha',element:'#error_alterar_senha',texto:'*A nova senha deve ter mais que 6 caracteres!'});
							}

						}else{
							res.json({error:'repetir_nova_senha',element:'#error_alterar_senha',texto:'*Por-favor repetir corretamente a nova senha!'});
						}
					}else{
						res.json({error:'senha_atual_errada',element:'#error_alterar_senha',texto:'*Senha atual não confere!'});
					}

				});
			}else{
				res.json({error:'repetir_senha_vazia',element:'#error_alterar_senha',texto:'*Por-favor repetir a nova senha!'});
			}	
		}else{
			res.json({error:'nova_senha_vazia',element:'#error_alterar_senha',texto:'*Nova senha não pode ser vazia!'});
		}

	}else{
		res.json({error:'senha_atual_vazia',element:'#error_alterar_senha',texto:'*Senha atual não pode ser vazia!'});
	}


});



router.post('/desativar_minha_conta', function(req, res, next) {
	POST = req.body;

	console.log('XXXXXXXXXXXXX ESTOU NO desativar_minha_conta XXXXXXXXXXXXXXXXXXXXX');
	console.log(POST);
	console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');


	const novo_desativar_conta = new desativarContaModel({ 
		id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
		desativar:true
	});

	novo_desativar_conta.save(function (err) {
		if (err) {
			return handleError(err);
		}else{
			res.json(data);
		}
	});




});






module.exports = router;
