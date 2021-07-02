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

const usuarioRoboModel = require('../model/usuarioRoboModel.js');

var usuarioStatusModel = require('../model/usuarioStatusModel.js');
var moment = require('moment');
moment.locale('pt-br');

var usuarioCorretoraModel = require('../model/usuarioCorretoraModel.js');
var usuarioParametrosAlgoritmoModel = require('../model/usuarioParametrosAlgoritmoModel');

var licencaModel = require('../model/licencaModel.js');
var desativarContaModel = require('../model/desativarContaModel.js');




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


								res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'minha_conta/minha_conta', data: data, usuario: req.session.usuario});
							});
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

	usuarioStatusModel.find({id_usuario:mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_status_del){

		console.log("data_usuario_status_del");
		console.log(data_usuario_status_del);


		usuarioModel.find({'_id':mongoose.Types.ObjectId(req.session.usuario.id)},function(err,data_usuario_del){
			console.log("data_usuario_del");
			console.log(data_usuario_del);


			const novo_desativar_conta = new desativarContaModel({ 
				id_usuario:mongoose.Types.ObjectId(req.session.usuario.id),
				desativar:true
			});


			var titulo = 'Desativação E-Investor';

			var html = cabecalho_email +
			"Olá " + data_usuario_del[0].nome + ", lamentamos que você queira desativar seu plano da licença  " + data_usuario_status_del[0].nome_algoritmo_escolhido  +". Todos os seus dados e acessos serão excluídos, bem como todas integrações feitas serão desativadas. <br>Essa ação é irreversível."+
			"<br><br>Caso possamos fazer algo para que você continue utilizando o sistema, ou tenha ocorrido algum problema, estamos a disposição para lhe atender e ajudar."+
			"<br><br>Atenciosamente,<br>Equipe E-Investor"+
			"<br><br><span style='font-size:9px;'>Algo errado? Entre em contato conosco respondendo este e-mail.</span>"+
			rodape_email;


			var text = "<b>E-Investor</b>"+
			"Olá " + data_usuario_del[0].nome + ", lamentamos que você queira desativar seu plano da licença  " + data_usuario_status_del[0].nome_algoritmo_escolhido  +". Todos os seus dados e acessos serão excluídos, bem como todas integrações feitas serão desativadas. <br>Essa ação é irreversível."  +
			"<br><br>Caso possamos fazer algo para que você continue utilizando o sistema, ou tenha ocorrido algum problema, estamos a disposição para lhe atender e ajudar."+
			"<br><br>Atenciosamente,<br>Equipe E-Investor"+
			"<br><br><span>Algo errado? Entre em contato conosco respondendo este e-mail.</span>"+ rodape_email_t;


			control.SendMail(data_usuario_del[0].email, titulo ,text,html);
			control.SendMail('suporte@einvestor.com.br', titulo ,text,html);



			novo_desativar_conta.save(function (err) {
				if (err) {
					return handleError(err);
				}else{
					res.json(data);
				}
			});

		}).sort({'_id':-1}).limit(1);

	}).sort({'_id':-1}).limit(1);




});






module.exports = router;
