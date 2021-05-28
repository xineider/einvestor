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

var usuarioCorretoraModel = require('../model/usuarioCorretoraModel.js');

var usuarioParametrosAlgoritmoModel = require('../model/usuarioParametrosAlgoritmoModel');

var usuarioStatusModel = require('../model/usuarioStatusModel.js');
var moment = require('moment');
moment.locale('pt-br');



var cabecalho_email = "<div style='background:#fff;background-color:#fff;margin:0px auto; max-width:600px;'>"+
"<div style='background:#fff;width:100%;'>"+
"<img style='width:100%;' src='https://einvestor.com.br/public/images/pdf/00.png'>"+
"</div>"+
"<div style='background:#f7f9fb;color:#000;width:100%;'>"+
"<div style='padding:20px;font-size:13px;'>";

var rodape_email = "<br><br><div><img style='max-width:250px;' src='https://einvestor.com.br/public/images/e_investor_logo.png'></div>"+
"<br><br><span style='color:#666666;font-size:10px;'>A E-Investor é uma plataforma desenvolvida pela Innvicton Tecnologia, que desenvolve softwares e tecnologias quantitativas para usuários investidores. A Innvicton Tecnologia é uma empresa de desenvolvimento de software e não provê qualquer tipo de serviço de investimento ou corretagem nos mercados financeiros. Sistema desenvolvido exclusivamente para integração ao testador de estratégias da Metaquotes para geração de parâmetros de algoritmo pelo usuário com auxílio de Inteligência Artificial. Não atuamos como prestadora de informações de mercado, ou como receptora/transmissora de ordens de negociação para o sistema de distribuição de valores mobiliários. Esta plataforma, serviços e sistemas não constitui nem deve ser interpretado como oferta ou solicitação de compra ou venda de qualquer instrumento financeiro, ficando a decisão de investimento sempre a critério exclusivo do usuário com base em seu juízo de valor. O investidor deve consultar seu próprio assessor ou conselheiro jurídico, tributário, regulatório, técnico de negócios, de investimentos, financeiro e contábil, na medida que julgar necessário, para assessoria na escolha de definição de softwares, plataformas, sistemas, algoritmos, estratégias e setups. O investidor que realiza operações de renda variável é o único responsável pelas decisões de investimento ou de abstenção de investimento que tomar.</span>"+
"<br><br><span style='color:#666666;font-size:10px;'>Os sistemas da E-Investor são totalmente parametrizáveis (White Box), contendo seus parâmetros abertos para preenchimento pelo usuário da maneira que ele preferir e julgar mais adequada, cabendo a cada usuário a tomada de decisão da estratégia ou setup que vai utilizar. Comercialização de estratégias automatizadas; CNAE 6202-3/00; Regulatório CVM referente a Instrução CVM n° 598/18 conforme Item 15 Do Ofício-Circular CVM/SIN 02/19. Copyright - Innvicton Tecnologia - Todos os direitos reservados.</span>"+
"<br><br><span style='color:#666666;font-size:10px;'>Empresas e tecnologias as quais utilizamos ou recomendamos não tem nenhuma ligação ou participação em qualquer negócio, produto ou serviço da E-Investor, e não obstante não tem ligação com este site, sistema ou conteúdo de nenhuma maneira comercial ou explícita.</span>"+
"<br><br><span style='color:#999999;font-size:10px;'>AVISO LEGAL </span>"+
"<br><span style='color:#999999;font-size:10px;'>Esta mensagem é destinada exclusivamente para a(s) pessoa(s) a quem é dirigida, podendo conter informação confidencial e/ou legalmente privilegiada. Desde já fica notificado de abster-se a divulgar, copiar, distribuir, ou, de qualquer forma, utilizar a informação contida nesta mensagem, por ser ilegal. Caso você tenha recebido esta mensagem por engano, pedimos que nos retorne este E-mail, promovendo, desde logo, a eliminação do seu conteúdo em sua base de dados, registros ou sistema de controle. Fica desprovida de eficácia e validade a mensagem que contiver vínculos obrigacionais, expedida por quem não detenha poderes de representação.</span>"+			"</div>"+
"</div>"+
"</div>";


var rodape_email_t = "<br><br><span>A E-Investor é uma plataforma desenvolvida pela Innvicton Tecnologia, que desenvolve softwares e tecnologias quantitativas para usuários investidores. A Innvicton Tecnologia é uma empresa de desenvolvimento de software e não provê qualquer tipo de serviço de investimento ou corretagem nos mercados financeiros. Sistema desenvolvido exclusivamente para integração ao testador de estratégias da Metaquotes para geração de parâmetros de algoritmo pelo usuário com auxílio de Inteligência Artificial. Não atuamos como prestadora de informações de mercado, ou como receptora/transmissora de ordens de negociação para o sistema de distribuição de valores mobiliários. Esta plataforma, serviços e sistemas não constitui nem deve ser interpretado como oferta ou solicitação de compra ou venda de qualquer instrumento financeiro, ficando a decisão de investimento sempre a critério exclusivo do usuário com base em seu juízo de valor. O investidor deve consultar seu próprio assessor ou conselheiro jurídico, tributário, regulatório, técnico de negócios, de investimentos, financeiro e contábil, na medida que julgar necessário, para assessoria na escolha de definição de softwares, plataformas, sistemas, algoritmos, estratégias e setups. O investidor que realiza operações de renda variável é o único responsável pelas decisões de investimento ou de abstenção de investimento que tomar.</span>"+
"<br><br><span>Os sistemas da E-Investor são totalmente parametrizáveis (White Box), contendo seus parâmetros abertos para preenchimento pelo usuário da maneira que ele preferir e julgar mais adequada, cabendo a cada usuário a tomada de decisão da estratégia ou setup que vai utilizar. Comercialização de estratégias automatizadas; CNAE 6202-3/00; Regulatório CVM referente a Instrução CVM n° 598/18 conforme Item 15 Do Ofício-Circular CVM/SIN 02/19. Copyright - Innvicton Tecnologia - Todos os direitos reservados.</span>"+
"<br><br><span>Empresas e tecnologias as quais utilizamos ou recomendamos não tem nenhuma ligação ou participação em qualquer negócio, produto ou serviço da E-Investor, e não obstante não tem ligação com este site, sistema ou conteúdo de nenhuma maneira comercial ou explícita.</span>"+
"<br><br><span>AVISO LEGAL </span>"+
"<br><span>Esta mensagem é destinada exclusivamente para a(s) pessoa(s) a quem é dirigida, podendo conter informação confidencial e/ou legalmente privilegiada. Desde já fica notificado de abster-se a divulgar, copiar, distribuir, ou, de qualquer forma, utilizar a informação contida nesta mensagem, por ser ilegal. Caso você tenha recebido esta mensagem por engano, pedimos que nos retorne este E-mail, promovendo, desde logo, a eliminação do seu conteúdo em sua base de dados, registros ou sistema de controle. Fica desprovida de eficácia e validade a mensagem que contiver vínculos obrigacionais, expedida por quem não detenha poderes de representação.</span>"+			"</div>"+
"</div>"+
"</div>";




router.get('/', function(req, res, next) {

	usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){

		var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
		var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');
		data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;
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

			console.log('qqqqqqqqqqq administracao qqqqqqqqqqqqqq');
			console.log(data_usuarios);
			console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');



			data[req.session.usuario.id+'_usuarios']= data_usuarios;
			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/administracao',  data: data, usuario: req.session.usuario});

		});
	}).sort({'_id':-1}).limit(1);
});


router.get('/adicionar-usuario', function(req, res, next) {

	usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){

		var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
		var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');
		data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;
		data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;

		usuariosModel.find({nivel:2},function(err,data_parceiros){
			data[req.session.usuario.id+'_parceiros']= data_parceiros;
			data.link_sistema = '/sistema';
			data[req.session.usuario.id+'_numero_menu'] = 1;
			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/adicionar_usuario', data: data, usuario: req.session.usuario});
		});
	}).sort({'_id':-1}).limit(1);
});


router.get('/alterar-usuario/:id_usuario', function(req, res, next) {


	id_usuario = req.params.id_usuario;

	usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){

		var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
		var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');
		data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;
		data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;

		usuariosModel.findOne({'_id':id_usuario},function(err,data_usuario_e){
			data[req.session.usuario.id+'_usuario_e']= data_usuario_e;

			usuariosModel.find({nivel:2},function(err,data_parceiros){
				data[req.session.usuario.id+'_parceiros']= data_parceiros;
				data.link_sistema = '/sistema';
				data[req.session.usuario.id+'_numero_menu'] = 1;
				res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/alterar_usuario', data: data, usuario: req.session.usuario});
			});
		});
	}).sort({'_id':-1}).limit(1);
});

router.get('/carregar-parceiros', function(req, res, next) {
	console.log('fui chamado o carregar-parceiros');
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



router.get('/popup-corretora-parametros-correta/:id_usuario', function(req, res, next) {
	console.log(req.params.id_usuario);

	id_usuario = req.params.id_usuario;

	console.log('estou no popup-corretora-parametros-correta');
	console.log('estou no popup-corretora-parametros-correta');
	console.log('estou no popup-corretora-parametros-correta');


	usuariosModel.findOne({'_id':id_usuario},function(err,data_usuario){
		data[req.session.usuario.id+'_usuario_sincronizacao_correto']= data_usuario;


		usuarioCorretoraModel.find({id_usuario:id_usuario},function(err,data_usuario_corretora){
			console.log('data_usuario_corretora');
			console.log(data_usuario_corretora);
			console.log('data_usuario_corretora');
			data[req.session.usuario.id+'_corretora_sincronizacao_correto']= data_usuario_corretora;

			console.log('data_usuario');
			console.log(data);

			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/popup-certo-corretora-parametros', data: data, usuario: req.session.usuario});

		}).sort({'_id':-1}).limit(1);
	});
});




router.get('/popup-corretora-parametros-errada/:id_usuario', function(req, res, next) {
	console.log(req.params.id_usuario);

	id_usuario = req.params.id_usuario;

	console.log('estou no popup-corretora-parametros-errada');
	console.log('estou no popup-corretora-parametros-errada');
	console.log('estou no popup-corretora-parametros-errada');


	usuariosModel.findOne({'_id':id_usuario},function(err,data_usuario){
		data[req.session.usuario.id+'_usuario_sincronizacao_correto']= data_usuario;


		usuarioCorretoraModel.find({id_usuario:id_usuario},function(err,data_usuario_corretora){
			console.log('data_usuario_corretora');
			console.log(data_usuario_corretora);
			console.log('data_usuario_corretora');
			data[req.session.usuario.id+'_corretora_sincronizacao_correto']= data_usuario_corretora;

			console.log('data_usuario');
			console.log(data);

			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/popup-errado-corretora-parametros', data: data, usuario: req.session.usuario});

		}).sort({'_id':-1}).limit(1);
	});
});


router.get('/popup-enviar-email-sem-parametros/:id_usuario', function(req, res, next) {
	console.log(req.params.id_usuario);

	id_usuario = req.params.id_usuario;

	console.log('estou no popup-enviar-email-sem-parametros');
	console.log('estou no popup-enviar-email-sem-parametros');
	console.log('estou no popup-enviar-email-sem-parametros');


	usuariosModel.findOne({'_id':id_usuario},function(err,data_usuario){
		data[req.session.usuario.id+'_usuario_sincronizacao_correto']= data_usuario;


		usuarioCorretoraModel.find({id_usuario:id_usuario},function(err,data_usuario_corretora){
			console.log('data_usuario_corretora');
			console.log(data_usuario_corretora);
			console.log('data_usuario_corretora');
			data[req.session.usuario.id+'_corretora_sincronizacao_correto']= data_usuario_corretora;

			console.log('data_usuario');
			console.log(data);

			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/popup-enviar-email-sem-parametros', data: data, usuario: req.session.usuario});

		}).sort({'_id':-1}).limit(1);
	});
});

router.get('/popup-enviar-email-sem-conta/:id_usuario', function(req, res, next) {
	console.log(req.params.id_usuario);

	id_usuario = req.params.id_usuario;

	console.log('estou no popup-enviar-email-sem-conta');
	console.log('estou no popup-enviar-email-sem-conta');
	console.log('estou no popup-enviar-email-sem-conta');


	usuariosModel.findOne({'_id':id_usuario},function(err,data_usuario){
		data[req.session.usuario.id+'_usuario_sincronizacao_correto']= data_usuario;
		console.log('data_usuario');
		console.log(data);
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/popup-enviar-email-sem-conta', data: data, usuario: req.session.usuario});
	});
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



router.post('/sincronizar-conta-corretora', function(req, res, next) {

	POST = req.body;

	console.log('@@@@@@@@@@@ sincronizar-conta-corretora @@@@@@@@@@');
	console.log(POST);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

	usuariosModel.findOne({'_id':POST.id_usuario},function(err,data_usuario){
		console.log('---------------------------');
		console.log(data_usuario);
		console.log('---------------------------');
		console.log(data_usuario.nome);


		usuarioCorretoraModel.findOneAndUpdate({'_id':POST.id_corretora},{'$set':{'validado':true,'sincronizado':true}},function(err){


			var nova_data = new Date();

			usuarioStatusModel.findOneAndUpdate({'id_usuario':POST.id_usuario},{'$set':{'sistema_online':true,'conta':'Sincronizada','algoritmo':'Sincronizada','data_atualizacao':nova_data}},function(err,data_r){
				
				console.log('batata');
				console.log(data_r);


				usuarioParametrosAlgoritmoModel.findOne({'id_usuario':POST.id_usuario},function(err,data_parametros_user){

					console.log('data_parametros_user');
					console.log(data_parametros_user);
					console.log('--------------------');

					var titulo = 'E-Investor - ' + data_usuario.nome + ' seu sistema está ativo';

					var html = cabecalho_email +
					"<b>Olá " + data_usuario.nome + ", sua conta e sua estratégia '"+data_parametros_user.setup_name[0]+"' foram sincronizadas com sucesso e seu sistema está ativo.</b>"+
					"<br><br>Parabéns! Você acaba de ativar sua estratégia '"+data_parametros_user.setup_name[0]+"' em sua conta."+
					"<br><br><span style='font-size:9px;'>Algo errado? Entre em contato conosco respondendo este e-mail.</span>"+
					rodape_email;


					var text = "<b>E-Investor</b>"+
					"<br><b>Olá " + data_usuario.nome + ", sua conta e sua estratégia '"+data_parametros_user.setup_name[0]+"' foram sincronizadas com sucesso e seu sistema está ativo.</b>"+
					"<br><br>Parabéns! Você acaba de ativar sua estratégia " + data_parametros_user.setup_name[0]+ "'em sua conta."+
					"<br><br><span>Algo errado? Entre em contato conosco respondendo este e-mail.</span>"+ rodape_email_t;


					control.SendMail(data_usuario.email, titulo ,text,html);
					control.SendMail('suporte@einvestor.com.br', titulo ,text,html);

					res.json(data);


				}).sort({'_id':-1}).limit(1);

			});
		});
	});

});




router.post('/dessincronizar-conta-corretora', function(req, res, next) {

	POST = req.body;

	console.log('@@@@@@@@@@@ dessincronizar-conta-corretora @@@@@@@@@@');
	console.log(POST);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

	usuariosModel.findOne({'_id':POST.id_usuario},function(err,data_usuario){
		console.log('---------------------------');
		console.log(data_usuario);
		console.log('---------------------------');
		console.log(data_usuario.nome);


		usuarioCorretoraModel.findOneAndUpdate({'_id':POST.id_corretora},{'$set':{'validado':true,'sincronizado':false}},function(err){


			var nova_data = new Date();

			usuarioStatusModel.findOneAndUpdate({'id_usuario':POST.id_usuario},{'$set':{'sistema_online':false,'conta':'Não Sincronizado','algoritmo':'Sincronizando','data_atualizacao':nova_data}},function(err,data_r){
				
				console.log('batata');
				console.log(data_r);


				usuarioParametrosAlgoritmoModel.findOne({'id_usuario':POST.id_usuario},function(err,data_parametros_user){

					console.log('data_parametros_user');
					console.log(data_parametros_user);
					console.log('--------------------');

					var titulo = 'E-Investor - ' + data_usuario.nome + ' seu sistema não está ativo.';

					var html = cabecalho_email +
					"<b>Olá " + data_usuario.nome + ", sua conta e sua estratégia '"+data_parametros_user.setup_name[0]+"' não foram sincronizadas com sucesso e seu sistema não está ativo.</b>"+
					"<br><br><b style='color:#cc0000;'>Erro: Dados de conta inválidos.</b>"+
					"<br><br><b><span style='color:#1155cc;'>Correção necessária:</span> Por favor insira os dados novamente e confirme se estão corretos antes de enviar <a href='https://einvestor.com.br/plataforma/sistema/automacao'target='_blank'>clicando aqui</a>.</b>"+
					"<br><br><span style='font-size:9px;'>Algo errado? Entre em contato conosco respondendo este e-mail.</span>"+
					rodape_email;


					var text = "<b>E-Investor</b>"+
					"<br><b>Olá " + data_usuario.nome + ", sua conta e sua estratégia '"+data_parametros_user.setup_name[0]+"' não foram sincronizadas com sucesso e seu sistema não está ativo.</b>"+
					"<br><br><b>Erro: Dados de conta inválidos.</b>"+
					"<br><br><b><span>Correção necessária:</span> Por favor insira os dados novamente e confirme se estão corretos antes de enviar <a href='https://einvestor.com.br/plataforma/sistema/automacao'target='_blank'>clicando aqui</a>.</b>"+
					"<br><br><span>Algo errado? Entre em contato conosco respondendo este e-mail.</span>"+ rodape_email_t;


					control.SendMail(data_usuario.email, titulo ,text,html);
					control.SendMail('suporte@einvestor.com.br', titulo ,text,html);
					

					res.json(data);


				}).sort({'_id':-1}).limit(1);

			});
		});
	});

});


router.post('/enviar-email-usuario-sem-parametros', function(req, res, next) {

	POST = req.body;

	console.log('@@@@@@@@@@@ enviar-email-usuario-sem-parametros @@@@@@@@@@');
	console.log(POST);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

	usuariosModel.findOne({'_id':POST.id_usuario},function(err,data_usuario){
		console.log('---------------------------');
		console.log(data_usuario);
		console.log('---------------------------');
		console.log(data_usuario.nome);

		var titulo = 'E-Investor - ' + data_usuario.nome + ' seu sistema não está ativo.';

		var html = cabecalho_email +
		"<b>Olá " + data_usuario.nome + ", ainda há a necessidade de enviar sua estratégia!</b>"+
		"<br><br><b><span style='color:#1155cc;'>Correção necessária:</span> Por favor <a href='https://einvestor.com.br/plataforma/sistema/automacao/parametros' target='_blank'>clique aqui</a> para finalizar o processo de automação.</b>"+
		"<br><br><span style='font-size:9px;'>Algo errado? Entre em contato conosco respondendo este e-mail.</span>"+
		rodape_email;


		var text = "<b>E-Investor</b>"+
		"<br><b>Olá " + data_usuario.nome + "ainda há a necessidade de enviar sua estratégia!</b>"+
		"<br><br><b><span>Correção necessária:</span> Por favor <a href='https://einvestor.com.br/plataforma/sistema/automacao/parametros' target='_blank'>clique aqui</a> para finalizar o processo de automação.</b>"+
		"<br><br><span>Algo errado? Entre em contato conosco respondendo este e-mail.</span>"+ rodape_email_t;


		control.SendMail(data_usuario.email, titulo ,text,html);
		control.SendMail('suporte@einvestor.com.br', titulo ,text,html);

		res.json(data);
	});
});



router.post('/enviar-email-usuario-sem-conta', function(req, res, next) {

	POST = req.body;

	console.log('@@@@@@@@@@@ enviar-email-usuario-sem-parametros @@@@@@@@@@');
	console.log(POST);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

	usuariosModel.findOne({'_id':POST.id_usuario},function(err,data_usuario){
		console.log('---------------------------');
		console.log(data_usuario);
		console.log('---------------------------');
		console.log(data_usuario.nome);

		var titulo = 'E-Investor - ' + data_usuario.nome + ' seu sistema não está ativo.';

		var html = cabecalho_email +
		"<b>Olá " + data_usuario.nome + ", ainda há a necessidade de enviar os dados da sua conta da corretora!</b>"+
		"<br><br><b><span style='color:#1155cc;'>Correção necessária:</span> Por favor <a href='https://einvestor.com.br/plataforma/sistema/automacao/' target='_blank'>clique aqui</a> para finalizar o processo de automação.</b>"+
		"<br><br><span style='font-size:9px;'>Algo errado? Entre em contato conosco respondendo este e-mail.</span>"+
		rodape_email;


		var text = "<b>E-Investor</b>"+
		"<br><b>Olá " + data_usuario.nome + "ainda há a necessidade de enviar os dados da sua conta da corretora!</b>"+
		"<br><br><b><span>Correção necessária:</span> Por favor <a href='https://einvestor.com.br/plataforma/sistema/automacao/' target='_blank'>clique aqui</a> para finalizar o processo de automação.</b>"+
		"<br><br><span>Algo errado? Entre em contato conosco respondendo este e-mail.</span>"+ rodape_email_t;


		control.SendMail(data_usuario.email, titulo ,text,html);
		control.SendMail('suporte@einvestor.com.br', titulo ,text,html);

		res.json(data);
	});
});






module.exports = router;
