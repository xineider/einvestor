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


var usuariosModel = require('../model/usuariosModel.js');



router.get('/', function(req, res, next) {

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
});


router.get('/adicionar-usuario', function(req, res, next) {

	usuariosModel.find({nivel:2},function(err,data_parceiros){
		data[req.session.usuario.id+'_parceiros']= data_parceiros;
		data.link_sistema = '/sistema';
		data[req.session.usuario.id+'_numero_menu'] = 1;
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/adicionar_usuario', data: data, usuario: req.session.usuario});
	});
});


router.get('/alterar-usuario/:id_usuario', function(req, res, next) {


	id_usuario = req.params.id_usuario;

	usuariosModel.findOne({'_id':id_usuario},function(err,data_usuario_e){
		data[req.session.usuario.id+'_usuario_e']= data_usuario_e;

		usuariosModel.find({nivel:2},function(err,data_parceiros){
			data[req.session.usuario.id+'_parceiros']= data_parceiros;
			data.link_sistema = '/sistema';
			data[req.session.usuario.id+'_numero_menu'] = 1;
			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/alterar_usuario', data: data, usuario: req.session.usuario});
		});
	});
});

router.get('/carregar-parceiros', function(req, res, next) {
	console.log('fui chamado o carregar-parceiros');
	console.log('yay');
	console.log('fffffffff');

	usuariosModel.find({nivel:2},function(err,data_parceiros){
		data[req.session.usuario.id+'_parceiros']= data_parceiros;
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/carregar_parceiros', data: data, usuario: req.session.usuario});
	});
});




router.post('/adicionar-usuario', function(req, res, next) {
	POST = req.body;
	console.log('adicionar usuario');
	console.log(POST);
	console.log('aaaaaaaaaaaaaaaaaa');

	if(POST.email.length != 0){

		usuariosModel.find({email:POST.email},function(err,data_usuario_email){
			console.log('data_usuario_email');
			console.log(data_usuario_email);


			if(data_usuario_email.length == 0){
				var nova_senha = Math.random().toString(36).substring(5);
				var novaSenhaCriptografa = control.Encrypt(nova_senha);

				console.log('nova_senha');
				console.log(nova_senha);
				console.log('nnnnnnnnnnnnnnnnnnnnnn');

				if(POST.nivel == 3){

					if(POST.id_parceiro == 'Não possui'){


						const novo_usuario = new usuariosModel({ 						
							nome:POST.nome,
							cpf:POST.cpf,
							email:POST.email,
							senha:novaSenhaCriptografa,
							nivel:POST.nivel,
							deletado:false
						});

						console.log('novo usuario');
						console.log(novo_usuario);
						console.log('uuuuuuuuuuuuuu');

						novo_usuario.save(function (err) {
							if (err) {
								return handleError(err);
							}else{
								res.json(data);
							}
						});

					}else{

						const novo_usuario = new usuariosModel({ 
							id_parceiro:mongoose.Types.ObjectId(POST.id_parceiro),
							nome:POST.nome,
							cpf:POST.cpf,
							email:POST.email,
							senha:novaSenhaCriptografa,
							nivel:POST.nivel,
							deletado:false
						});

						console.log('novo usuario');
						console.log(novo_usuario);
						console.log('uuuuuuuuuuuuuu');

						novo_usuario.save(function (err) {
							if (err) {
								return handleError(err);
							}else{
								res.json(data);
							}
						});
					}





				}else{
					const novo_usuario = new usuariosModel({ 
						nome:POST.nome,
						cpf:POST.cpf,
						email:POST.email,
						senha:novaSenhaCriptografa,
						nivel:POST.nivel,
						deletado:false
					});

					console.log('novo usuario');
					console.log(novo_usuario);
					console.log('uuuuuuuuuuuuuu');

					novo_usuario.save(function (err) {
						if (err) {
							return handleError(err);
						}else{
							res.json(data);
						}
					});

				}

				var html = "<div style='background:#ffffff;background-color:#ffffff;margin:0px auto; max-width:600px;'>\
				<div style='background:rgba(219,101,116,0.95);width:100%;height:50px; padding:20px; text-align:center;color:#ffffff;width:100%;'>\
				<div style='width:100%;font-size:20px;'>Robocopy</div>\
				<div style='width:100%;font-size:16px;margin-top:5px;'>Simples, fácil e lucrativo. Copie traders consistentes no mercado.</div>\
				</div>\
				<div style='background:#2d3035;color:#8a8d93;width:100%;padding:20px;'>"+
				"Olá, você está recebendo este e-mail pois pediu para recuperar sua senha"+
				"<br>Sua nova senha no Robocopy é: "+nova_senha+
				"<br>Caso não pediu para recuperar a sua senha entre em contato com o Suporte pelo telegram"+
				'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
				'</div>'+
				'<div style="width:100%;height:20px; padding:5px 20px;color:#8a8d93;width:100%;font-size:14px;">\
				* Não responda esta mensagem, ela é enviada automaticamente.'+
				'</div>\
				</div>';
				var text = "Olá, você está recebendo este e-mail pois pediu para recuperar sua senha"+
				"<br>Sua nova senha no Robocopy é: "+nova_senha+
				"<br>Caso não pediu para recuperar a sua senha entre em contato com o Suporte pelo telegram"+
				'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
				'<br>* Não responda esta mensagem, ela é enviada automaticamente.';

				control.SendMail(POST.email, 'Recuperação de Senha - Robocopy',text,html);	


			}else{
				res.json({error:'email_utilizado',element:'input[name="email"]',texto:'*O E-mail já está sendo utilizado!'});
			}

		});

	}else{
		res.json({error:'email_vazio',element:'input[name="email"]',texto:'*O E-mail não pode ser vazio!'});
	}

});


router.get('/popup-alterar-senha/:id_usuario', function(req, res, next) {

	console.log(req.params.id_usuario);

	id_usuario = req.params.id_usuario;

	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
	console.log('estou no alterar-senha');
	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

	console.log(id_usuario);


	usuariosModel.findOne({'_id':id_usuario},function(err,data_usuario){
		data[req.session.usuario.id+'_usuario_a']= data_usuario;
		console.log('data_usuario');
		console.log(data_usuario);

		// console.log('ddddddddddddddddddddd data dddddddddddddddddddddd');
		// console.log(data);
		// console.log('ddddddddddddddddddddddddddddddddddddddddddddddddd');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/alterar_senha', data: data, usuario: req.session.usuario});
	});
});

router.get('/popup-excluir-usuario/:id_usuario', function(req, res, next) {

	console.log(req.params.id_usuario);

	id_usuario = req.params.id_usuario;

	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
	console.log('estou no alterar-senha');
	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

	console.log(id_usuario);


	usuariosModel.findOne({'_id':id_usuario},function(err,data_usuario){
		data[req.session.usuario.id+'_usuario_a']= data_usuario;
		console.log('data_usuario');
		console.log(data_usuario);

		// console.log('ddddddddddddddddddddd data dddddddddddddddddddddd');
		// console.log(data);
		// console.log('ddddddddddddddddddddddddddddddddddddddddddddddddd');
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/excluir_usuario', data: data, usuario: req.session.usuario});
	});
});



router.post('/alterar-senha', function(req, res, next) {

	POST = req.body;

	console.log('RECUPERAR SENHA @@@@@@@@@@@@');
	console.log(POST);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');


	console.log('usuario find model');
	nova_senha = Math.random().toString(36).substring(5);

	var novaSenhaCriptografa = control.Encrypt(nova_senha);

	console.log('nova_senha: '+nova_senha);
	console.log('novaSenhaCriptografa: ' +novaSenhaCriptografa);

	usuariosModel.findOne({'_id':POST.id_usuario},function(err,data_usuario){

		usuariosModel.findOneAndUpdate({'_id':POST.id_usuario},{'$set':{'senha':novaSenhaCriptografa}},function(err){
			if (err) {
				return handleError(err);
			}else{

				var html = "<div style='background:#ffffff;background-color:#ffffff;margin:0px auto; max-width:600px;'>\
				<div style='background:rgba(219,101,116,0.95);width:100%;height:50px; padding:20px; text-align:center;color:#ffffff;width:100%;'>\
				<div style='width:100%;font-size:20px;'>Canga</div>\
				<div style='width:100%;font-size:16px;margin-top:5px;'>Simples, fácil e lucrativo. Copie traders consistentes no mercado.</div>\
				</div>\
				<div style='background:#2d3035;color:#8a8d93;width:100%;padding:20px;'>"+
				"Olá, você está recebendo este e-mail pois a administração resetou a sua senha"+
				"<br>Sua nova senha no Canga é: "+nova_senha+
				'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
				'</div>'+
				'<div style="width:100%;height:20px; padding:5px 20px;color:#8a8d93;width:100%;font-size:14px;">\
				* Não responda esta mensagem, ela é enviada automaticamente.'+
				'</div>\
				</div>';

				var text = "Olá, você está recebendo este e-mail pois a administração resetou a sua senha"+
				"<br>Sua nova senha no Canga é: "+nova_senha+
				'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
				'<br> * Não responda esta mensagem, ela é enviada automaticamente.';

				control.SendMail(data_usuario.email, 'Recuperação de Senha - Canga',text,html);				
				res.json(data);
			}
		});

	});

});



router.post('/excluir-usuario', function(req, res, next) {

	POST = req.body;

	console.log('@@@@@@@@@@@ EXCLUIR USUARIO @@@@@@@@@@');
	console.log(POST);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

	usuariosModel.findOne({'_id':POST.id_usuario},function(err,data_usuario){

		usuariosModel.findOneAndUpdate({'_id':POST.id_usuario},{'$set':{'deletado':true}},function(err){
			if (err) {
				return handleError(err);
			}else{

				var html = "<div style='background:#ffffff;background-color:#ffffff;margin:0px auto; max-width:600px;'>\
				<div style='background:rgba(219,101,116,0.95);width:100%;height:50px; padding:20px; text-align:center;color:#ffffff;width:100%;'>\
				<div style='width:100%;font-size:20px;'>Canga</div>\
				<div style='width:100%;font-size:16px;margin-top:5px;'>Simples, fácil e lucrativo. Copie traders consistentes no mercado.</div>\
				</div>\
				<div style='background:#2d3035;color:#8a8d93;width:100%;padding:20px;'>"+
				"Olá, você está recebendo este e-mail pois a administração resetou a sua senha"+
				"<br>Sua nova senha no Canga é: "+
				'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
				'</div>'+
				'<div style="width:100%;height:20px; padding:5px 20px;color:#8a8d93;width:100%;font-size:14px;">\
				* Não responda esta mensagem, ela é enviada automaticamente.'+
				'</div>\
				</div>';

				var text = "Olá, você está recebendo este e-mail pois a administração resetou a sua senha"+
				"<br>Sua nova senha no Canga é: "+
				'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
				'<br> * Não responda esta mensagem, ela é enviada automaticamente.';

				control.SendMail(data_usuario.email, 'Recuperação de Senha - Canga',text,html);				
				res.json(data);
			}
		});

	});

});






module.exports = router;
