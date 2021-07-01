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

var licencaModel = require('../model/licencaModel.js');

var tokenModel = require('../model/tokenModel.js');

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



router.get('/usuarios', function(req, res, next) {

	console.log('estou aqui no usuarios ..............................');

	console.log('.....................................................');

	usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){

		var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
		var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');
		data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;
		data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;


		data.link_sistema = '/sistema';
		data[req.session.usuario.id+'_numero_menu'] = 31;




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

		},
		{
			$lookup:{
				from:'licenca',
				localField:'_id',
				foreignField:'id_usuario',
				as:'licenca'
			}

		}
		]).exec(function(err,data_usuarios){

			console.log('qqqqqqqqqqq administracao qqqqqqqqqqqqqq');
			console.log(data_usuarios);
			console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');

			console.log('data_usuarios.length: ' + data_usuarios.length);




			for(i=0; i<data_usuarios.length;i++){
				console.log('batata');
				console.log(i);

				var data_cadastro = new Date(data_usuarios[i].data_cadastro);

				var dia = data_cadastro.getDate();

				var mes = data_cadastro.getMonth() + 1;

				if(dia < 10){
					dia = '0' + dia;
				}

				if(mes < 10){
					mes = '0' + mes;
				}

				var data_f = dia + '/' + mes + '/' + data_cadastro.getFullYear();

				data_usuarios[i].data_cadastro_f = data_f;


				console.log('data_f: ' + data_f);

				if(data_usuarios[i].licenca.length > 0){
					var data_fim_licenca = new Date(data_usuarios[i].licenca[0].data_fim);

					var dia_l = data_fim_licenca.getDate();

					var mes_l = data_fim_licenca.getMonth() + 1;

					if(dia_l < 10){
						dia_l = '0' + dia_l;
					}

					if(mes_l < 10){
						mes_l = '0' + mes_l;
					}

					var data_l_f = dia_l + '/' + mes_l + '/' + data_fim_licenca.getFullYear();

					data_usuarios[i].licenca[0].data_fim_f = data_l_f;

					console.log('data_l_f: ' + data_l_f);

				}

			}

			console.log('data_usuarios[5].licenca');
			console.log(data_usuarios[0].licenca.length);
			console.log(data_usuarios[5].licenca.length);


			data[req.session.usuario.id+'_usuarios']= data_usuarios;



			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/usuarios',  data: data, usuario: req.session.usuario});

		});
	}).sort({'_id':-1}).limit(1);
});

router.get('/token', function(req, res, next) {

	console.log('estou aqui no usuarios ..............................');

	console.log('.....................................................');

	usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status){

		var data_atualizacao_u = data_usuario_status[0].data_atualizacao;
		var data_atualizacao_uf = moment(data_atualizacao_u).utc().format('DD/MM/YYYY');
		data_usuario_status[0].data_atualizacao_f = data_atualizacao_uf;
		data[req.session.usuario.id+'_usuario_status'] = data_usuario_status;


		data.link_sistema = '/sistema';
		data[req.session.usuario.id+'_numero_menu'] = 32;

		var data_agora = new Date();


		tokenModel.find({deletado:false,data_fim:{$gte:data_agora}},function(err,data_token){
			console.log('nnnnnnnnnnnnnn data_token nnnnnnnnnnnnnnnnn');
			console.log(data_token);
			console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');


			for(i=0; i<data_token.length;i++){
				var data_inicio = new Date(data_token[i].data_inicio);
				var data_fim = new Date(data_token[i].data_fim);

				var dia_i = data_inicio.getDate();
				var dia_f = data_fim.getDate();

				console.log('dia_f: ' + dia_f);

				var mes_i = data_inicio.getMonth() + 1;
				var mes_f = data_fim.getMonth() + 1;

				if(dia_i < 10){
					dia_i = '0' + dia_i;
				}

				if(dia_f < 10){
					dia_f = '0' + dia_f;
				}

				if(mes_i < 10){
					mes_i = '0' + mes_i;
				}

				if(mes_f < 10){
					mes_f = '0' + mes_f;
				}

				var data_i = dia_i + '/' + mes_i + '/' + data_inicio.getFullYear();
				var data_f = dia_f + '/' + mes_f + '/' + data_fim.getFullYear();
				data_token[i].data_inicio_f = data_i;
				data_token[i].data_fim_f = data_f;
			}

			data[req.session.usuario.id+'_token']= data_token;
			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/token/token',  data: data, usuario: req.session.usuario});
		}).sort({'_id':-1});
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
	console.log('ffffffffffff');

	usuariosModel.find({nivel:2},function(err,data_parceiros){
		data[req.session.usuario.id+'_parceiros']= data_parceiros;
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/carregar_parceiros', data: data, usuario: req.session.usuario});
	});
});



router.post('/enviar-token', function(req, res, next) {
	POST = req.body;

	console.log('enviar-token');
	console.log(POST);
	console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');

	var array_letras_maius = ['A','B','C','D','E','F','G','H','J','K','M','P','Q','R','S','T','U','X','Y','Z'];
	var array_letras_minus = ['a','b','c','d','e','f','g','h','j','k','m','p','q','r','s','t','u','x','y','z'];

	var data_inicio = new Date(2021,5,24);
	data_inicio.setHours(0,0,0,0);
	var data_fim = new Date();
	data_fim.setHours(0,0,0,0);

	var data_base = new Date(2021,5,24);
	data_base.setHours(0,0,0,0);

	console.log('data_base:' + data_base);

	var array_insertMany = [];

	for(i = 2; i<20;i = i+2){



		const randomMaius = Math.floor(Math.random() * 20);
		const randomMinus = Math.floor(Math.random() * 20);
		const randomNumber = Math.floor(Math.random() * 10);
		const randomNumber2 = Math.floor(Math.random() * 100);

		

		
		
		

		data_fim.setDate(data_base.getDate() + i);
		data_inicio.setDate(data_base.getDate() + i - 2);
		
		

		var new_token = array_letras_minus[randomMinus] +  array_letras_maius[randomMaius] + randomNumber + data_inicio.getDate() + (data_inicio.getMonth() + 1) + randomNumber2 +array_letras_minus[randomNumber];


		console.log('new_token: ' + new_token);
		console.log('data_inicio:' + data_inicio);
		console.log('data_fim: ' + data_fim);

		array_insertMany.push({
			token:new_token,
			data_inicio: data_inicio,
			data_fim: data_fim,
			deletado:false,
			data_cadastro:new Date()
		});

		// console.log('======================================');
		// console.log(array_insertMany);
		// console.log('======================================');

		// const novo_token = new tokenModel({ 						
		// 	token:new_token,
		// 	data_inicio: data_inicio,
		// 	data_fim: data_fim,
		// 	deletado:false,
		// 	data_cadastro:new Date()
		// });

		// console.log(novo_token);

		// console.log('----------------------------------------');



		// novo_token.save(function (err) {
		// 	if (err) {
		// 		return handleError(err);
		// 	}else{

		// 	}
		// });

		








		





	}

	console.log('--------insert many -------');
	console.log(array_insertMany);
	console.log('---------------------------');







});





router.post('/adicionar-usuario', function(req, res, next) {
	POST = req.body;
	console.log('adicionar usuario');
	console.log(POST);
	console.log('aaaaaaaaaaaaaaaa');

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


router.get('/popup-ativacao-licenca/:id_usuario', function(req, res, next) {
	console.log(req.params.id_usuario);

	id_usuario = req.params.id_usuario;

	console.log('estou no popup-ativacao-licenca');
	console.log('estou no popup-ativacao-licenca');
	console.log('estou no popup-ativacao-licenca');


	usuariosModel.findOne({'_id':id_usuario},function(err,data_usuario){
		data[req.session.usuario.id+'_usuario_ativacao_licenca']= data_usuario;
		console.log('data_usuario');
		console.log(data);
		res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'administracao/popup-ativar-licenca-usuario', data: data, usuario: req.session.usuario});
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


router.post('/ativacao-licenca-usuario', function(req, res, next) {

	POST = req.body;

	console.log('@@@@@@@@@@@ ativacao-licenca-usuario @@@@@@@@@@');
	console.log(POST);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

	usuariosModel.findOne({'_id':POST.id_usuario},function(err,data_usuario){
		console.log('---------------------------');
		console.log(data_usuario);
		console.log('---------------------------');
		console.log(data_usuario.nome);

		licencaModel.find({id_usuario:POST.id_usuario},function(err,data_licenca){

			var data_agora = new Date();
			var data_fim_licenca = data_licenca[0].data_fim;

			const diferenca_tempo = data_fim_licenca - data_agora;
			const diferenca_dias = Math.ceil(diferenca_tempo / (1000 * 60 * 60 * 24));

			console.log('diferenca_dias: ' + diferenca_dias);


			usuarioStatusModel.find({id_usuario:POST.id_usuario},function(err,data_usuario_status){

				console.log(data_usuario_status);


				var titulo = 'Olá ' + data_usuario.nome + ' sua licença expira hoje';

				var html = cabecalho_email +
				"<b>Olá " + data_usuario.nome + ", seu sistema requer atenção! Seu período de teste gratuito da licença " + data_usuario_status[0].nome_algoritmo_escolhido +" expira hoje. Evite a interrupção do serviço, <a href='https://einvestor.com.br/plataforma/sistema/' target='_blank'>clique aqui</a> para acessar a área logada e assinar o plano vigente ou fazer um upgrade na assinatura desejada. </b>"+
				"<br><br><span style='font-size:9px;'>Algo errado? Entre em contato conosco respondendo este e-mail.</span>"+
				rodape_email;


				var text = "<b>E-Investor</b>"+
				"<b>Olá " + data_usuario.nome + ", seu sistema requer atenção! Seu período de teste gratuito da licença " + data_usuario_status[0].nome_algoritmo_escolhido +" expira hoje. Evite a interrupção do serviço, <a href='https://einvestor.com.br/plataforma/sistema/' target='_blank'>clique aqui</a> para acessar a área logada e assinar o plano vigente ou fazer um upgrade na assinatura desejada. </b>"+
				"<br><br><span>Algo errado? Entre em contato conosco respondendo este e-mail.</span>"+ rodape_email_t;


				control.SendMail(data_usuario.email, titulo ,text,html);
				control.SendMail('suporte@einvestor.com.br', titulo ,text,html);


				usuariosModel.findOneAndUpdate({'_id':POST.id_usuario},{'$set':{'licenca_pedido_ativacao':true}},function(err){
					res.json(data);
				});
			}).sort({'_id':-1}).limit(1);
		}).sort({'_id':-1}).limit(1);
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
