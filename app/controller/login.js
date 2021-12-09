// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var data = {};
var app = express();


app.use(require('express-is-ajax-request'));

const mongoose = require('mongoose');


/* Conexão Mongo Db*/

const usuarioModel = require('../model/usuariosModel.js');


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



/* GET pagina de login. */
router.get('/', function(req, res, next) {
	if (typeof req.session.usuario != 'undefined' && req.session.id_usuario != 0) {
		res.redirect('/plataforma/sistema');
		console.log('entrei aqui onde o usuario está definido');
	} else {
		res.render('login/index', {});
		console.log('não definido');
	}
});


/* POST enviando o login para verificação. */
router.post('/', function(req, res, next) {
	// Recebendo o valor do post
	POST = req.body;
	POST.senha = control.Encrypt(POST.senha);
	POST.email = POST.email.toLowerCase();
	POST.email = POST.email.trim();
	console.log('NNNNNNNNNNNNNN POST LOGIN NNNNNNN');
	console.log(POST);
	console.log('NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN');

	usuarioModel.findOne({'email':POST.email,'senha':POST.senha,'deletado':false},function(err,data_login){
		console.log('dddddddddddddddddddddddddddddd');
		console.log('data_login');
		console.log('dddddddddddddddddddddddddddddd');
		if(data_login != null){
			req.session.usuario = {};
			req.session.usuario.id = data_login['_id'];
			req.session.usuario.nivel = data_login['nivel'];
			req.session.usuario.nome = data_login['nome'];
			req.session.usuario.email = data_login['email'];
			req.session.usuario.foto = data_login['foto']
			console.log('req.session.usuario');
			console.log(req.session.usuario);
			res.redirect('/plataforma/sistema');
		}else{
			console.log('estou caindo aqui no erro do login ou senha incorreto');
			res.render('login/index', { erro: 'Login ou senha incorreto(s).', tipo_erro: 'login' });
		}

	});
});

/* GET pagina de login. */
router.get('/logout', function(req, res, next) {
	req.session.destroy(function(err) {
		console.log(err);
	});
	res.render('login/index', {});
});



router.post('/recuperar/senha', function(req, res, next) {

	POST = req.body;

	console.log('RECUPERAR SENHA @@@@@@@@@@@@');
	console.log(POST);
	console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

	usuarioModel.findOne({'email':POST.email},function(err,data){
		console.log('usuario find model');
		if(data != null){
			nova_senha = Math.random().toString(36).substring(4);

			var novaSenhaCriptografa = control.Encrypt(nova_senha);

			console.log('nova_senha: '+nova_senha);
			console.log('novaSenhaCriptografa: ' +novaSenhaCriptografa);

			usuarioModel.findOneAndUpdate({'email':POST.email},{'$set':{'senha':novaSenhaCriptografa}},function(err){
				if (err) {
					return handleError(err);
				}else{

					var titulo = 'Recuperação de Senha - E-Investor';

					var html = cabecalho_email +
					"Olá, você está recebendo este e-mail pois pediu para recuperar sua senha"+
					"<br>Sua nova senha no E-Investor é: "+nova_senha+
					"<br>Caso não pediu para recuperar a sua senha entre em contato conosco por este e-mail"+
					"<br>Acesse a plataforma através do link: <a href='https://einvestor.com.br/plataforma/' target='_blank'>https://einvestor.com.br/plataforma/</a>"+
					'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
					rodape_email;

					var text = "<b>E-Investor</b>"+
					"<br><b>Olá, você está recebendo este e-mail pois pediu para recuperar sua senha"+
					"<br>Sua nova senha no E-Investor é: "+nova_senha+
					"<br>Caso não pediu para recuperar a sua senha entre em contato conosco por este e-mail"+
					"<br>Acesse a plataforma através do link: <a href='https://einvestor.com.br/plataforma/' target='_blank'>https://einvestor.com.br/plataforma/</a>"+
					'<br><br>Não mostre sua senha para ninguém. A sua conta é responsabilidade sua.'+
					rodape_email_t;

					control.SendMail(POST.email, titulo,text,html);				
					res.json(data);
				}
			});

		}else{
			res.json(['email_nao_cadastrado']);
		}

	});
});


module.exports = router;