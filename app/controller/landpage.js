// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var data = {};
var app = express();

const mongoose = require('mongoose');

app.use(require('express-is-ajax-request'));


const regrasAlgoritmoModel = require('../model/regrasAlgoritmoModel.js');

const contatoFormularioModel = require('../model/contatoFormularioModel.js');

const usuarioModel = require('../model/usuariosModel.js');

var usuarioStatusModel = require('../model/usuarioStatusModel.js');

var usuarioRoboModel = require('../model/usuarioRoboModel.js');

var ultimosDadosContatoFormularioModel = require('../model/ultimosDadosContatoFormularioModel.js');


var licencaModel = require('../model/licencaModel.js');


var roboModel = require('../model/roboModel.js');


const relatorioModel = require('../model/relatorioModel.js');




const formCurrency = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2
});

function transformar_porcentagem(valor,robo,capital){
	var arrumado = valor * robo / capital * 100;
	arrumado = parseFloat(arrumado).toFixed(2).replace('.',',');

	return arrumado;
}



/* Conexão Mongo Db*/

var cabecalho_email = "<div style='background:#fff;background-color:#fff;margin:0px auto; max-width:600px;'>"+
"<div style='background:#fff;width:100%;'>"+
"<img style='width:100%;' src='http://einvestor.com.br/public/images/pdf/00.png'>"+
"</div>"+
"<div style='background:#f7f9fb;color:#000;width:100%;'>"+
"<div style='padding:20px;font-size:13px;'>";

var rodape_email = "<br><br><div><img style='max-width:250px;' src='http://einvestor.com.br/public/images/e_investor_logo.png'></div>"+
"<br><br><span style='color:#666666;font-size:10px;'>A E-Investor é uma plataforma desenvolvida pela Innvicton Tecnologia, que desenvolve softwares e tecnologias quantitativas para usuários investidores. A Innvicton Tecnologia é uma empresa de desenvolvimento de software e não provê qualquer tipo de serviço de investimento ou corretagem nos mercados financeiros. Sistema desenvolvido exclusivamente para integração ao testador de estratégias da Metaquotes para geração de parâmetros de algoritmo pelo usuário com auxílio de Inteligência Artificial. Não atuamos como prestadora de informações de mercado, ou como receptora/transmissora de ordens de negociação para o sistema de distribuição de valores mobiliários. Esta plataforma, serviços e sistemas não constitui nem deve ser interpretado como oferta ou solicitação de compra ou venda de qualquer instrumento financeiro, ficando a decisão de investimento sempre a critério exclusivo do usuário com base em seu juízo de valor. O investidor deve consultar seu próprio assessor ou conselheiro jurídico, tributário, regulatório, técnico de negócios, de investimentos, financeiro e contábil, na medida que julgar necessário, para assessoria na escolha de definição de softwares, plataformas, sistemas, algoritmos, estratégias e setups. O investidor que realiza operações de renda variável é o único responsável pelas decisões de investimento ou de abstenção de investimento que tomar.</span>"+
"<br><br><span style='color:#666666;font-size:10px;'>Os sistemas da E-Investor são totalmente parametrizáveis (White Box), contendo seus parâmetros abertos para preenchimento pelo usuário da maneira que ele preferir e julgar mais adequada, cabendo a cada usuário a tomada de decisão da estratégia ou setup que vai utilizar. Comercialização de estratégias automatizadas; CNAE 6202-3/00; Regulatório CVM conforme Item 15 Do Ofício-Circular CVM/SIN 02/19. Copyright - Innvicton Tecnologia - Todos os direitos reservados.</span>"+
"<br><br><span style='color:#666666;font-size:10px;'>Empresas e tecnologias as quais utilizamos ou recomendamos não tem nenhuma ligação ou participação em qualquer negócio, produto ou serviço da E-Investor, e não obstante não tem ligação com este site, sistema ou conteúdo de nenhuma maneira comercial ou explícita.</span>"+
"<br><br><span style='color:#999999;font-size:10px;'>AVISO LEGAL </span>"+
"<br><span style='color:#999999;font-size:10px;'>Esta mensagem é destinada exclusivamente para a(s) pessoa(s) a quem é dirigida, podendo conter informação confidencial e/ou legalmente privilegiada. Desde já fica notificado de abster-se a divulgar, copiar, distribuir, ou, de qualquer forma, utilizar a informação contida nesta mensagem, por ser ilegal. Caso você tenha recebido esta mensagem por engano, pedimos que nos retorne este E-mail, promovendo, desde logo, a eliminação do seu conteúdo em sua base de dados, registros ou sistema de controle. Fica desprovida de eficácia e validade a mensagem que contiver vínculos obrigacionais, expedida por quem não detenha poderes de representação.</span>"+			"</div>"+
"</div>"+
"</div>";


var rodape_email_t = "<br><br><span>A E-Investor é uma plataforma desenvolvida pela Innvicton Tecnologia, que desenvolve softwares e tecnologias quantitativas para usuários investidores. A Innvicton Tecnologia é uma empresa de desenvolvimento de software e não provê qualquer tipo de serviço de investimento ou corretagem nos mercados financeiros. Sistema desenvolvido exclusivamente para integração ao testador de estratégias da Metaquotes para geração de parâmetros de algoritmo pelo usuário com auxílio de Inteligência Artificial. Não atuamos como prestadora de informações de mercado, ou como receptora/transmissora de ordens de negociação para o sistema de distribuição de valores mobiliários. Esta plataforma, serviços e sistemas não constitui nem deve ser interpretado como oferta ou solicitação de compra ou venda de qualquer instrumento financeiro, ficando a decisão de investimento sempre a critério exclusivo do usuário com base em seu juízo de valor. O investidor deve consultar seu próprio assessor ou conselheiro jurídico, tributário, regulatório, técnico de negócios, de investimentos, financeiro e contábil, na medida que julgar necessário, para assessoria na escolha de definição de softwares, plataformas, sistemas, algoritmos, estratégias e setups. O investidor que realiza operações de renda variável é o único responsável pelas decisões de investimento ou de abstenção de investimento que tomar.</span>"+
"<br><br><span>Os sistemas da E-Investor são totalmente parametrizáveis (White Box), contendo seus parâmetros abertos para preenchimento pelo usuário da maneira que ele preferir e julgar mais adequada, cabendo a cada usuário a tomada de decisão da estratégia ou setup que vai utilizar. Comercialização de estratégias automatizadas; CNAE 6202-3/00; Regulatório CVM conforme Item 15 Do Ofício-Circular CVM/SIN 02/19. Copyright - Innvicton Tecnologia - Todos os direitos reservados.</span>"+
"<br><br><span>Empresas e tecnologias as quais utilizamos ou recomendamos não tem nenhuma ligação ou participação em qualquer negócio, produto ou serviço da E-Investor, e não obstante não tem ligação com este site, sistema ou conteúdo de nenhuma maneira comercial ou explícita.</span>"+
"<br><br><span>AVISO LEGAL </span>"+
"<br><span>Esta mensagem é destinada exclusivamente para a(s) pessoa(s) a quem é dirigida, podendo conter informação confidencial e/ou legalmente privilegiada. Desde já fica notificado de abster-se a divulgar, copiar, distribuir, ou, de qualquer forma, utilizar a informação contida nesta mensagem, por ser ilegal. Caso você tenha recebido esta mensagem por engano, pedimos que nos retorne este E-mail, promovendo, desde logo, a eliminação do seu conteúdo em sua base de dados, registros ou sistema de controle. Fica desprovida de eficácia e validade a mensagem que contiver vínculos obrigacionais, expedida por quem não detenha poderes de representação.</span>"+			"</div>"+
"</div>"+
"</div>";





/* GET pagina de landpage. */
router.get('/', function(req, res, next) {

	console.log('==================================');
	console.log('estou no landpage');
	console.log('==================================');

	data.numero_menu = 1;

	regrasAlgoritmoModel.find({deletado:false},function(err,data_algoritmo){
		data.regras_algoritmo = data_algoritmo;

		roboModel.find({},function(err2,data_algoritmo){
			data.algoritmo = data_algoritmo;



			console.log('ggggggggggggggggggg get do landpage ggggggggggggggg');
			console.log(data);
			console.log('ggggggggggggggggggggggggggggggggggggggggggggggggggg');

			console.log('aaaaaaaaaaaaaaaaaaaaaa algoritmo aaaaaaaaaaaaaaaaaaaaaaaaa');
			console.log(data.algoritmo);
			console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
			if( !err2 ) {

				res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/index',  message: data});

				//res.render('landpage/index', { message: data});

			}

		}).sort({'_id':-1});

	}).sort({'_id':-1}).limit(1);
});

router.post('/enviar-formulario-conhecer', function(req, res, next) {
	POST = req.body;

	console.log('estou no enviar formulario conhecer eeeeeeeeee');
	console.log(POST);
	console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');

	var pretencao_investimento;

	console.log('----------typeof POST.investe_em_renda_variavel != undefined');
	console.log(typeof POST.investe_em_renda_variavel != 'undefined');

	POST.email = POST.email.toLowerCase();
	POST.email = POST.email.trim();

	if(POST.investe_em_renda_variavel == 'nao' || typeof POST.investe_em_renda_variavel == 'undefined'){
		pretencao_investimento = 0;
		console.log('entrei aqui no nao');
	}else{
		pretencao_investimento = POST.pretencao_investimento;

	}


	const novo_contato = new contatoFormularioModel({ 						
		nome:POST.nome,
		email:POST.email,
		telefone:POST.telefone,
		como_chegou:POST.como_chegou,
		investe_em_renda_variavel:POST.investe_em_renda_variavel,
		pretencao_investimento:pretencao_investimento,
		deletado:false,
		data_cadastro:new Date()
	});


	if(pretencao_investimento == '100k'){
		pretencao_investimento = 100000;
	}else if(pretencao_investimento == '200k'){
		pretencao_investimento = 200000;
	}else if(pretencao_investimento == '300k'){
		pretencao_investimento = 300000;
	}else if(pretencao_investimento == '500k'){
		pretencao_investimento = 500000;
	}else if(pretencao_investimento == '1m'){
		pretencao_investimento = 1000000;
	}else if(pretencao_investimento == 'nao_pretendo'){
		pretencao_investimento = 0;
	}

	var possui_30_dias = 'normal';


	if(POST.acess_key == 'einvestor30g'){
		console.log('é igual ao acess key');
		possui_30_dias = 'gratis';
	}

	if(POST.acess_key === 'investor3080'){
		possui_30_dias = 'gratis_80'
	}

	console.log('novo_contato');
	console.log(novo_contato);
	console.log('ccccccccccccccccccccccccccccccc');


	var titulo = 'E-Investor - Obrigado ' + POST.nome;




	var html = cabecalho_email +
	"<b>Olá " + POST.nome + ", estamos muito felizes em ter você aqui.</b>"+
	"<br><br><b>Obrigado pelo seu interesse em nosso sistema, " + POST.email+ " é seu e-mail de cadastro inicial na E-Investor.</b>"+
	"<br><br>Caso você ainda não tenha feito a compra de uma licença, poderá simular novamente <a href='http://einvestor.com.br/' target='_blank'>Clicando aqui.</a>" +
	"<br><br><span style='font-size:9px;'>Algo errado? Entre em contato conosco respondendo este e-mail.</span>"+
	rodape_email;


	var text = "<b>E-Investor</b>"+
	"<br><b>Olá " + POST.nome + ", estamos muito felizes em ter você aqui.</b>"+
	"<br><br><b>Obrigado pelo seu interesse em nosso sistema, " + POST.email+ " é seu e-mail de cadastro inicial na E-Investor.</b>"+
	"<br><br>Caso você ainda não tenha feito a compra de uma licença, poderá simular novamente <a href='http://einvestor.com.br/' target='_blank'>Clicando aqui.</a>" +
	"<br><br><span>Algo errado? Entre em contato conosco respondendo este e-mail.</span>"+ rodape_email_t;


	control.SendMail(POST.email, titulo ,text,html);

	control.SendMail('suporte@einvestor.com.br', titulo ,text,html);

	novo_contato.save(function (err) {
		if (err) {
			return handleError(err);
		}else{
			res.json({pretencao_investimento:pretencao_investimento,possui_30dias:possui_30_dias});
		}
	});

});


router.get('/assinar_30dias', function(req, res, next) {


	res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/parabens_escolha_sistema',  message: data});

	ultimosDadosContatoFormularioModel.findOne({},function(err,data_ultimo_contato){

		console.log('data_ultimo_contato');
		console.log(data_ultimo_contato);
		console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuu');



	}).sort({'_id':-1}).limit(1);


});


router.post('/criar-usuario-redirecionar', function(req, res, next) {

	POST = req.body;

	console.log('cccccccccccccc estou no crair usuario redirecionar ccccccccccccccccccccccccc');
	console.log(POST);
	console.log('cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc');

	POST.senha = control.Encrypt(POST.senha);
	POST.email = POST.email.toLowerCase();
	POST.email = POST.email.trim();



	roboModel.findOne({valor:POST.algoritmo},function(err,data_algoritmo){

		console.log('------------------ data_algoritmo -----------------');
		console.log(data_algoritmo);
		console.log('---------------------------------------------------');

		console.log('data_algoritmo._id')
		console.log(data_algoritmo._id);

		usuarioModel.find({email:POST.email},function(err,data_usuario){

			console.log('uuuuuuuuuuuuuuuuuuuuuu data usuario uuuuuuuuuuuuuuuuuu');
			console.log(data_usuario);
			console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');

			console.log(data_usuario == null);
			console.log(data_usuario.length);

			if(data_usuario.length == 0){

				const novo_usuario = new usuarioModel({ 						
					nome:POST.nome,
					email:POST.email,
					senha:POST.senha,
					telefone:POST.telefone,
					foto:'',
					cpf:POST.cpf,
					nivel:3,
					deletado:false,
					data_cadastro:new Date()
				});

				console.log('-------------------- novo usuario ----------------------');
				console.log(novo_usuario);
				console.log('--------------------------------------------------------');



				novo_usuario.save(function (err,usuario_retorno_save) {

					console.log('err');
					console.log(err);

					console.log('usuario_retorno_save');
					console.log(usuario_retorno_save);
					console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrr');


					if (err) {
						return handleError(err);
					}else{	


						const novo_status_usuario = new usuarioStatusModel({
							id_usuario:mongoose.Types.ObjectId(usuario_retorno_save._id),
							numero_operacoes:0,
							sistema_online:false,
							nome_algoritmo_escolhido:data_algoritmo.nome,
							valor_aplicado:POST.capital,
							pagamento:true,
							conta:'Não Sincronizado',
							algoritmo:'Não Sincronizado',
							aceite_termos_inicio:false,
							deletado:false,
							data_atualizacao:new Date(),
							data_cadastro:new Date()
						});

						console.log('novo_status_usuario');
						console.log(novo_status_usuario);
						console.log('ssssssssssssssssssssssssssssss');




						novo_status_usuario.save(function(err){


							if (err) {
								return handleError(err);
							}else{

								const novo_usuario_algoritmo = new usuarioRoboModel({
									id_usuario:mongoose.Types.ObjectId(usuario_retorno_save._id),
									id_robo:mongoose.Types.ObjectId(data_algoritmo._id),
									rentabilidade_aa:POST.rentabilidade_aa
								});

								console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaa');
								console.log(novo_usuario_algoritmo);
								console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaa');


								novo_usuario_algoritmo.save(function(err){


									if(err){
										return handleError(err);	
									}else{

										var data_fim_licenca = new Date();
										data_fim_licenca.setDate(data_fim_licenca.getDate() + 30);



										const novo_usuario_licenca = new licencaModel({
											id_usuario:mongoose.Types.ObjectId(usuario_retorno_save._id),
											data_fim:data_fim_licenca,
											deletado:false,
											data_cadastro: new Date()
										});


										novo_usuario_licenca.save(function(err){

											console.log('lllllllllllllll licenca llllllllllll');
											console.log(novo_usuario_licenca);
											console.log('llllllllllllllllllllllllllllllllllll');


											var titulo = 'E-Investor - Bem-vindo ' + POST.nome;


											var capital_f = formCurrency.format(POST.capital);
											var preco_f = formCurrency.format(data_algoritmo.preco);


											var html = cabecalho_email +
											"<b>Olá " + POST.nome + ", estamos muito felizes em ter você aqui.</b>"+
											"<br><b>Este é o seu login: </b>" + POST.email +
											"<br><b>E este é o link de acesso do sistema:</b> <a href='http://einvestor.com.br/' target='_blank'>http://einvestor.com.br/</a>"+
											"<br><br>Obrigado por escolher nosso sistema " + data_algoritmo.nome +
											"<br><br>Valor " + preco_f + " do sistema plano mensal." +
											"<br><br>Capital Inicial " +capital_f + 
											"<br><br><span style='font-size:9px;'>Algo errado? Entre em contato conosco respondendo este e-mail.</span>" +
											"<br><br><b>Agora vamos ao passo a passo para você ativar sua estratégia em sua conta:</b>"+
											"<br><br><b>1º Passo:</b> Você precisa ter uma conta em uma das corretoras compatíveis, são elas: Modal Mais, Órama, Rico, Terra e XP Investimentos."+
											"<br><br>Agora logado no sistema da sua corretora você precisa contratar/ativar a plataforma de negociação MetaTrader 5 conta real/produção, Netting. Após a contratação você receberá um e-mail da corretora com os dados de acesso."+
											"<br><br>Você deve sempre checar com a corretora se o capital necessário informado ao contratar o nosso sistema já está alocado na conta da corretora e do MetaTrader 5 e se a mesma já está habilitada a realizar operações nos ativos futuros mini índice e mini dólar. Caso ainda não tenha capital na corretora basta enviar via TED de sua conta para a corretora conforme o indicado por ela, não se preocupe, todas são corretoras regulamentadas e muito seguras, e o capital só pode ser enviado e recebido por contas bancárias do mesmo titular da conta da corretora. Recomendamos a ativação da RLP para maior liquidez e custo zero de corretagem."+
											"<br><br><b>2º Passo:</b> Faço o login no sistema <a href='http://einvestor.com.br/' target='_blank'>E-Investor</a> e conecte sua conta MetaTrader 5 operacional no menu automação e leia e aceite os termos para integração."+
											"<br><br><b>3º Passo:</b> Após integrar sua conta, na sequência você vai configurar os parâmetros de sua estratégia, fazer a otimização e a integração do algoritmo em sua conta, leia os termos e aceite para integração."+
											"<br><br><b>Feito isso é só esperar até 3 dias úteis para receber a confirmação de que está tudo certo e o sistema está conectado e pronto para automatizar as ordens da estratégia criada.</b>"+
											"<br><br><b>Segurança</b>"+
											"<br><br>O valor necessário para operações <b>fica em sua conta</b> da corretora de sua escolha, com total segurança, liquidez e controle único e exclusivo seu, apenas <b>integramos o sistema</b> a plataforma de negociação."+
											"<br>Prezamos a transparência e responsabilidade quando o assunto é sério, visando entregar o máximo de experiência não só tecnológica, mas também informativa, por isso temos tudo que você precisa aqui em nossos <a href='http://einvestor.com.br/termos_uso' target='_blank'>Termos e condições de uso - Avisos legais e de responsabilidade.</a>"+
											rodape_email;

											var text = "<b>E-Investor</b>"+
											"<b>Olá " + POST.nome + ", estamos muito felizes em ter você aqui.</b>"+
											"<br><b>Este é o seu login: </b>" + POST.email +
											"<br><b>E este é o link de acesso do sistema:</b> <a href='http://einvestor.com.br/' target='_blank'>http://einvestor.com.br/</a>"+
											"<br><br>Obrigado por escolher nosso sistema " + data_algoritmo.nome +
											"<br><br>Valor " + preco_f + " do sistema plano mensal." +
											"<br><br>Capital Inicial " +capital_f + 
											"<br><br><span>Algo errado? Entre em contato conosco respondendo este e-mail.</span>" +
											"<br><br><b>Agora vamos ao passo a passo para você ativar sua estratégia em sua conta:</b>"+
											"<br><br><b>1º Passo:</b> Você precisa ter uma conta em uma das corretoras compatíveis, são elas: Modal Mais, Órama, Rico, Terra e XP Investimentos."+
											"<br><br>Agora logado no sistema da sua corretora você precisa contratar/ativar a plataforma de negociação MetaTrader 5 conta real/produção, Netting. Após a contratação você receberá um e-mail da corretora com os dados de acesso."+
											"<br><br>Você deve sempre checar com a corretora se o capital necessário informado ao contratar o nosso sistema já está alocado na conta da corretora e do MetaTrader 5 e se a mesma já está habilitada a realizar operações nos ativos futuros mini índice e mini dólar. Caso ainda não tenha capital na corretora basta enviar via TED de sua conta para a corretora conforme o indicado por ela, não se preocupe, todas são corretoras regulamentadas e muito seguras, e o capital só pode ser enviado e recebido por contas bancárias do mesmo titular da conta da corretora. Recomendamos a ativação da RLP para maior liquidez e custo zero de corretagem."+
											"<br><br><b>2º Passo:</b> Faço o login no sistema <a href='http://einvestor.com.br/' target='_blank'>E-Investor</a> e conecte sua conta MetaTrader 5 operacional no menu automação e leia e aceite os termos para integração."+
											"<br><br><b>3º Passo:</b> Após integrar sua conta, na sequência você vai configurar os parâmetros de sua estratégia, fazer a otimização e a integração do algoritmo em sua conta, leia os termos e aceite para integração."+
											"<br><br><b>Feito isso é só esperar até 3 dias úteis para receber a confirmação de que está tudo certo e o sistema está conectado e pronto para automatizar as ordens da estratégia criada.</b>"+
											"<br><br><b>Segurança</b>"+
											"<br><br>O valor necessário para operações <b>fica em sua conta</b> da corretora de sua escolha, com total segurança, liquidez e controle único e exclusivo seu, apenas <b>integramos o sistema</b> a plataforma de negociação."+
											"<br>Prezamos a transparência e responsabilidade quando o assunto é sério, visando entregar o máximo de experiência não só tecnológica, mas também informativa, por isso temos tudo que você precisa aqui em nossos <a href='http://einvestor.com.br/termos_uso' target='_blank'>Termos e condições de uso - Avisos legais e de responsabilidade.</a>"+
											rodape_email_t;

											control.SendMail(POST.email, titulo ,text,html);

											control.SendMail('suporte@einvestor.com.br', titulo ,text,html);
											



											req.session.usuario = {};
											req.session.usuario.id = usuario_retorno_save._id;
											req.session.usuario.nivel =usuario_retorno_save.nivel;
											req.session.usuario.nome = usuario_retorno_save.nome;
											req.session.usuario.email = usuario_retorno_save.email;
											req.session.usuario.foto = '';


											console.log('rrrrrrrrrrrrrr req.session.usuario rrrrrrrrrrrrrrr');
											console.log(req.session.usuario);
											console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');


											var usuario_criado = true;

											res.json({usuario_criado:usuario_criado});

										});

}

});


}


});








}
});

}else{

	console.log('cai aqui no erro do email já existente');

	res.json({error:'email_ja_existe_sistema',element:'input[name="email"]',texto:'*Este E-mail já existe no nosso sistema, você pode acessar pela minha conta!'});
}
});

});




});


router.post('/assinar_30dias_gratuitos/:algoritmo/:capital/:rentabilidade_aa', function(req, res, next) {

	POST = req.body;

	console.log('--------------- assinar_30_dias_gratuitos -----------------');
	console.log(POST);
	console.log('-----------------------------------------------------------');

	POST.email = POST.email.toLowerCase();
	POST.email = POST.email.trim();

	console.log('estou no assinar_30_dias_gratuitos');

	var algoritmo = req.params.algoritmo;
	var capital = req.params.capital;
	var rentabilidade_aa = req.params.rentabilidade_aa;

	console.log('algoritmo:' + algoritmo);
	console.log('capital:' + capital);


	console.log('');
	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

	const ultimo_contato = new ultimosDadosContatoFormularioModel({
		nome:POST.nome,
		email:POST.email,
		telefone:POST.telefone,
		como_chegou:POST.como_chegou,
		acess_key:POST.acess_key,
		capital:capital,
		algoritmo:algoritmo,
		rentabilidade_aa:rentabilidade_aa,
		deletado:false,
		data_cadastro: new Date()
	});

	ultimo_contato.save(function(err,data_ultimo_contato){
		if (err) {
			return handleError(err);
		}else{

			data.ultimo_contato = data_ultimo_contato;

			console.log('data_ultimo_contato');
			console.log(data_ultimo_contato);
			console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');


			roboModel.findOne({valor:data_ultimo_contato.algoritmo},function(err,data_algoritmo){

				console.log('-----------------------');
				console.log(data_algoritmo);
				console.log('-----------------------');
				data.algoritmo = data_algoritmo;




				res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/parabens_escolha_sistema',  message: data});
			});
		}
	});

});




router.post('/cadastrar_ultimo_contato/:algoritmo/:capital/:rentabilidade_aa', function(req, res, next) {

	POST = req.body;

	console.log('--------------- cadastrar_ultimo_contato -----------------');
	console.log(POST);
	console.log('-----------------------------------------------------------');

	POST.email = POST.email.toLowerCase();
	POST.email = POST.email.trim();

	console.log('estou no cadastrar_ultimo_contato');

	var algoritmo = req.params.algoritmo;
	var capital = req.params.capital;
	var rentabilidade_aa = req.params.rentabilidade_aa;

	console.log('algoritmo:' + algoritmo);
	console.log('capital:' + capital);

	const ultimo_contato = new ultimosDadosContatoFormularioModel({
		nome:POST.nome,
		email:POST.email,
		telefone:POST.telefone,
		como_chegou:POST.como_chegou,
		acess_key:POST.acess_key,
		capital:capital,
		algoritmo:algoritmo,
		rentabilidade_aa:rentabilidade_aa,
		deletado:false,
		data_cadastro: new Date()
	});


	console.log('999999999999999999999 ultimo contato 999999999999999999999');
	console.log(ultimo_contato);
	console.log('9999999999999999999999999999999999999999999999999999999999');


	ultimo_contato.save(function(err,data_ultimo_contato){
		if (err) {
			return handleError(err);
		}else{
			res.json({});
		}
	});

});





router.post('/carregar_pagina_parabens', function(req, res, next) {
	POST = req.body;
	console.log('cccccccccccccc carregar_pagina_parabens ccccccccccccc');
	console.log(POST);
	console.log('ccccccccccccccccccccccccccccccccccccccccccccccccccccc');


	POST.email_l = POST.email_l.toLowerCase();
	POST.email_l = POST.email_l.trim();



	ultimosDadosContatoFormularioModel.findOne({email:POST.email_l},function(err,data_ultimo_contato){

		console.log('uuuuuuuuuuuuuuuuu data_ultimo_contato uuuuuuuuuuuuuuuuuu');
		console.log(data_ultimo_contato);
		console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');

		console.log(typeof data_ultimo_contato);

		console.log(data_ultimo_contato == null)

		if(data_ultimo_contato != null){

			data.ultimo_contato = data_ultimo_contato;

			roboModel.findOne({valor:data_ultimo_contato.algoritmo},function(err,data_algoritmo){

				console.log('-----------------------');
				console.log(data_algoritmo);
				console.log('-----------------------');
				data.algoritmo = data_algoritmo;

				res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/parabens_container',  message: data});


			});




		}else{
			res.json({error:'email_nao_existe',element:'input[name="email_l"]',texto:'*Este E-mail não existe no nosso sistema, por-favor utilize o que você utilizou no formulário na página inicial!'});
		}






	}).sort({'_id':-1});





});


router.get('/assinar_30dias/:algoritmo/:capital', function(req, res, next) {

	var algoritmo = req.params.algoritmo;
	var capital = req.params.capital;

	console.log('algoritmo:' + algoritmo);
	console.log('capital:' + capital);

	console.log('estou no assinar_30_dias_gratuitos');

	console.log('');
	console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');




	res.json({});

});


router.get('/escolher_sistema', function(req, res, next) {
	console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
	console.log('estou no termos_uso');
	console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');

	res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/assinar_acima_1800',message: data});
});



router.get('/termos_uso', function(req, res, next) {
	console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
	console.log('estou no termos_uso');
	console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');

	res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/termos_uso',message: data});
});


router.get('/politica_privacidade', function(req, res, next) {
	console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
	console.log('estou no politica_privacidade');
	console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');

	res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/politica_privacidade',message: data});
});



router.get('/whitepaper', function(req, res, next) {
	console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
	console.log('estou no whitepaper');
	console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');

	data.numero_menu = 2;

	res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/white_paper',message: data});
});


router.get('/quem_somos', function(req, res, next) {
	console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
	console.log('estou no quem somos');
	console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
	data.numero_menu = 3;
	res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/quem_somos',message: data});
});



router.get('/faq', function(req, res, next) {
	console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
	console.log('estou no faq');
	console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
	data.numero_menu = 4;
	res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/faq',message: data});
});



router.get('/relatorio/:algoritmo/:capital', function(req, res, next) {

	console.log('estou no relatorio');

	var algoritmo = req.params.algoritmo;
	var capital = req.params.capital;

	console.log('algoritmo:' + algoritmo);
	console.log('capital:' + capital);

	var porc_reais = 'porc';




	roboModel.find({'valor':algoritmo},function(err,data_robo){

		console.log('------------- data_robo----------------');
		console.log(data_robo);
		console.log('---------------------------------------');

		relatorioModel.find({},function(err,data_relatorio){

			console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrr data_relatorio rrrrrrrrrrrrrrrrrrrrrrrrrrrr');
			console.log(data_relatorio);
			console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');

			console.log('estrategias');
			console.log(data_relatorio[0].estrategias);

			var capital = req.params.capital;
			console.log('capital:' + capital);

			for(i=0;i < data_relatorio[0].estrategias.length; i++){
				var net_profit = ((formCurrency.format(data_relatorio[0].estrategias[i].net_profit * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].net_profit_exib_reais = net_profit;
				data_relatorio[0].estrategias[i].net_profit_exib_perc = transformar_porcentagem(data_relatorio[0].estrategias[i].net_profit,data_robo[0].multiplicador,capital);

				var drawdown = ((formCurrency.format(data_relatorio[0].estrategias[i].drawdown * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].drawdown_exib_reais = drawdown;
				data_relatorio[0].estrategias[i].drawdown_exib_perc = transformar_porcentagem(data_relatorio[0].estrategias[i].drawdown,data_robo[0].multiplicador,capital);

				var average_trade = ((formCurrency.format(data_relatorio[0].estrategias[i].average_trade * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].average_trade_exib_reais = average_trade;
				data_relatorio[0].estrategias[i].average_trade_exib_perc = transformar_porcentagem(data_relatorio[0].estrategias[i].average_trade,data_robo[0].multiplicador,capital);

				var year_average = ((formCurrency.format(data_relatorio[0].estrategias[i].year_average * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].year_average_exib_reais = year_average;
				data_relatorio[0].estrategias[i].year_average_exib_perc = transformar_porcentagem(data_relatorio[0].estrategias[i].year_average,data_robo[0].multiplicador,capital);

				var daily_profit = ((formCurrency.format(data_relatorio[0].estrategias[i].daily_profit * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].daily_profit_exib_reais = daily_profit;
				data_relatorio[0].estrategias[i].daily_profit_exib_perc = transformar_porcentagem(data_relatorio[0].estrategias[i].daily_profit,data_robo[0].multiplicador,capital);


				var month_profit = ((formCurrency.format(data_relatorio[0].estrategias[i].month_profit * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].month_profit_exib_reais = month_profit;
				data_relatorio[0].estrategias[i].month_profit_exib_perc = transformar_porcentagem(data_relatorio[0].estrategias[i].month_profit,data_robo[0].multiplicador,capital);


				var average_trade = ((formCurrency.format(data_relatorio[0].estrategias[i].average_trade * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].estrategias[i].average_trade_exib = average_trade;
				data_relatorio[0].estrategias[i].average_trade_perc = transformar_porcentagem(data_relatorio[0].estrategias[i].average_trade,data_robo[0].multiplicador,capital);
			}

			for(i=0;i < data_relatorio[0].resume_performance.length; i++){
				var net_profit = ((formCurrency.format(data_relatorio[0].resume_performance[i].net_profit * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].resume_performance[i].net_profit_exib_reais = net_profit;
				data_relatorio[0].resume_performance[i].net_profit_exib_perc = transformar_porcentagem(data_relatorio[0].resume_performance[i].net_profit,data_robo[0].multiplicador,capital);

			}

			for(i=0;i < data_relatorio[0].monthly_performance.length; i++){

				var jan = ((formCurrency.format(data_relatorio[0].monthly_performance[i].jan * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].jan_exib_reais = jan;
				data_relatorio[0].monthly_performance[i].jan_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].jan,data_robo[0].multiplicador,capital);

				var fev = ((formCurrency.format(data_relatorio[0].monthly_performance[i].fev * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].fev_exib_reais = fev;
				data_relatorio[0].monthly_performance[i].fev_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].fev,data_robo[0].multiplicador,capital);

				var mar = ((formCurrency.format(data_relatorio[0].monthly_performance[i].mar * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].mar_exib_reais = mar;
				data_relatorio[0].monthly_performance[i].mar_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].mar,data_robo[0].multiplicador,capital);

				var apr = ((formCurrency.format(data_relatorio[0].monthly_performance[i].apr * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].apr_exib_reais = apr;
				data_relatorio[0].monthly_performance[i].apr_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].apr,data_robo[0].multiplicador,capital);

				var may = ((formCurrency.format(data_relatorio[0].monthly_performance[i].may * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].may_exib_reais = may;
				data_relatorio[0].monthly_performance[i].may_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].may,data_robo[0].multiplicador,capital);


				var jun = ((formCurrency.format(data_relatorio[0].monthly_performance[i].jun * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].jun_exib_reais = jun;
				data_relatorio[0].monthly_performance[i].jun_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].jun,data_robo[0].multiplicador,capital);


				var jul = ((formCurrency.format(data_relatorio[0].monthly_performance[i].jul * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].jul_exib_reais = jul;
				data_relatorio[0].monthly_performance[i].jul_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].jul,data_robo[0].multiplicador,capital);


				var aug = ((formCurrency.format(data_relatorio[0].monthly_performance[i].aug * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].aug_exib_reais = aug;
				data_relatorio[0].monthly_performance[i].aug_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].aug,data_robo[0].multiplicador,capital);


				var sep = ((formCurrency.format(data_relatorio[0].monthly_performance[i].sep * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].sep_exib_reais = sep;
				data_relatorio[0].monthly_performance[i].sep_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].sep,data_robo[0].multiplicador,capital);


				var oct = ((formCurrency.format(data_relatorio[0].monthly_performance[i].oct * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].oct_exib_reais = oct;
				data_relatorio[0].monthly_performance[i].oct_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].oct,data_robo[0].multiplicador,capital);


				var nov = ((formCurrency.format(data_relatorio[0].monthly_performance[i].nov * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].nov_exib_reais = nov;
				data_relatorio[0].monthly_performance[i].nov_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].nov,data_robo[0].multiplicador,capital);


				var dec = ((formCurrency.format(data_relatorio[0].monthly_performance[i].dec * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].dec_exib_reais = dec;
				data_relatorio[0].monthly_performance[i].dec_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].dec,data_robo[0].multiplicador,capital);


				var ytd = ((formCurrency.format(data_relatorio[0].monthly_performance[i].ytd * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].monthly_performance[i].ytd_exib_reais = ytd;
				data_relatorio[0].monthly_performance[i].ytd_exib_perc = transformar_porcentagem(data_relatorio[0].monthly_performance[i].ytd,data_robo[0].multiplicador,capital);

			}

			for(i=0;i < data_relatorio[0].stats.length; i++){
				var deviation = ((formCurrency.format(data_relatorio[0].stats[i].deviation * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].stats[i].deviation_exib_reais = deviation;
				data_relatorio[0].stats[i].deviation_exib_perc = transformar_porcentagem(data_relatorio[0].stats[i].deviation,data_robo[0].multiplicador,capital);

			}

			for(i=0;i < data_relatorio[0].trades.length; i++){
				var gross_profit = ((formCurrency.format(data_relatorio[0].trades[i].gross_profit * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].trades[i].gross_profit_exib_reais = gross_profit;
				data_relatorio[0].trades[i].gross_profit_exib_perc = transformar_porcentagem(data_relatorio[0].trades[i].gross_profit,data_robo[0].multiplicador,capital);

				var gross_loss = ((formCurrency.format(data_relatorio[0].trades[i].gross_loss * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].trades[i].gross_loss_exib_reais = gross_loss;
				data_relatorio[0].trades[i].gross_loss_exib_perc = transformar_porcentagem(data_relatorio[0].trades[i].gross_loss,data_robo[0].multiplicador,capital);

				var average_win = ((formCurrency.format(data_relatorio[0].trades[i].average_win * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].trades[i].average_win_exib_reais = average_win;
				data_relatorio[0].trades[i].average_win_exib_perc = transformar_porcentagem(data_relatorio[0].trades[i].average_win,data_robo[0].multiplicador,capital);

				var average_loss = ((formCurrency.format(data_relatorio[0].trades[i].average_loss * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].trades[i].average_loss_exib_reais = average_loss;
				data_relatorio[0].trades[i].average_loss_exib_perc = transformar_porcentagem(data_relatorio[0].trades[i].average_loss,data_robo[0].multiplicador,capital);

				var largest_win = ((formCurrency.format(data_relatorio[0].trades[i].largest_win * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].trades[i].largest_win_exib_reais = largest_win;
				data_relatorio[0].trades[i].largest_win_exib_perc = transformar_porcentagem(data_relatorio[0].trades[i].largest_win,data_robo[0].multiplicador,capital);

				var largest_loss = ((formCurrency.format(data_relatorio[0].trades[i].largest_loss * data_robo[0].multiplicador).replace('.','#')).replace(',','.')).replace('#',',');
				data_relatorio[0].trades[i].largest_loss_exib_reais = largest_loss;
				data_relatorio[0].trades[i].largest_loss_exib_perc = transformar_porcentagem(data_relatorio[0].trades[i].largest_loss,data_robo[0].multiplicador,capital);



			}


			data.relatorio= data_relatorio;

			data.porc_reais = porc_reais;

			


			res.render(req.isAjaxRequest() == true ? 'api' : 'montadorLandpage', {html: 'landpage/simulador_open', message: data});
			

		}).sort({'_id':-1}).limit(1);
});





});








module.exports = router;