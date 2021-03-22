// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var data = {};
var app = express();


app.use(require('express-is-ajax-request'));

const mongoose = require('mongoose');

const usuarioModel = require('../model/usuariosModel.js');

const roboModel = require('../model/roboModel.js');

const regrasAlgoritmoModel = require('../model/regrasAlgoritmoModel.js');

const formCurrency = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2
});




/* Conexão Mongo Db*/

console.log('==================================');
console.log('estou no landpage');
console.log('==================================');


/* GET pagina de login. */
router.get('/', function(req, res, next) {

	regrasAlgoritmoModel.find({deletado:false},function(err,data_algoritmo){
		data.regras_algoritmo = data_algoritmo;

		roboModel.find({},function(err,data_algoritmo){
			//data.algoritmo = data_algoritmo;
			console.log('ggggggggggggggggggg get do landpage ggggggggggggggg');
			console.log(data);
			console.log('ggggggggggggggggggggggggggggggggggggggggggggggggggg');

			res.render('landpage/landpage', {data:data});

		}).sort({'_id':-1});

	}).sort({'_id':-1}).limit(1);
});



router.post('/select_table_price', function(req, res, next) {
	POST = req.body;
	console.log('estou alterando o table price selector ');
	console.log(POST);
	console.log('ttttttttttttttttttttttttttttttttttttttttt');

	console.log('req.session.usuario.id: ' + req.session.usuario.id);

	var valor_minimo = parseInt(POST.valor_minimo);

	console.log('valor_minimo: ' + valor_minimo);

	regrasAlgoritmoModel.find({deletado:false},function(err,data_algoritmo){
		console.log('-data_algoritmo aaaaaaaaaaaaaaaaaa');
		console.log(data_algoritmo);
		console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
		data[req.session.usuario.id+'_algoritimo'] = data_algoritmo;


		roboModel.find({valor_minimo:{$lte:valor_minimo}},function(err,data_robo){
			
			data[req.session.usuario.id+'_capital']= valor_minimo;


			console.log('============================================ data ==========================');
			console.log(data);
			console.log('============================================================================');


			

			for(i=0;i < data_robo.length; i++){
				
				var rentabilidade_aa = ((data_algoritmo[0].media_ano * data_robo[i].multiplicador) / valor_minimo) * 100;
				var rentabilidade_aa_reais = (rentabilidade_aa * valor_minimo ) / 100;

				console.log('rentabilidade_aa_reais:' + rentabilidade_aa_reais);

				var volatilidade = data_algoritmo[0].volatilidade * data_robo[i].multiplicador;
				var maximo_rebaixamento = volatilidade /  valor_minimo * 100;

				volatilidade = formCurrency.format(volatilidade);
				volatilidade = ((volatilidade.replace('.','#')).replace(',','.')).replace('#',',');

				var preco_robo = formCurrency.format(data_robo[i].preco);
				preco_robo = ((preco_robo.replace('.','#')).replace(',','.')).replace('#',',');
				console.log('preco_robo:' + preco_robo);
				data_robo[i].preco_robo = preco_robo;

				var rentablidade_aa_reais_F = formCurrency.format(rentabilidade_aa_reais);
				rentablidade_aa_reais_F = ((rentablidade_aa_reais_F.replace('.','#')).replace(',','.')).replace('#',',');
				console.log('rentablidade_aa_reais_F: ' + rentablidade_aa_reais_F);

				


				console.log('*******************************************************');
				console.log('valor_minimo: ' + valor_minimo);
				console.log('rentabilidade_aa: ' + rentabilidade_aa);
				console.log('rentabilidade_aa_reais: ' + rentabilidade_aa_reais);
				console.log('volatilidade: ' + volatilidade);
				console.log('maximo_rebaixamento: ' + maximo_rebaixamento);
				console.log('******************************************************');
				rentabilidade_aa = parseFloat(rentabilidade_aa).toFixed(2).replace('.',',');
				maximo_rebaixamento = parseFloat(maximo_rebaixamento).toFixed(2).replace('.',',');





				data_robo[i].rentabilidade_aa = rentabilidade_aa;
				data_robo[i].rentabilidade_aa_reais = rentablidade_aa_reais_F;
				data_robo[i].volatilidade =  volatilidade;
				data_robo[i].maximo_rebaixamento =  maximo_rebaixamento;
			}



			data[req.session.usuario.id+'_robo']= data_robo;


			// console.log('rrrrrrrrrrrrrrrr');
			// console.log(data_robo);
			// console.log('rrrrrrrrrrrrrrrr');


			res.render(req.isAjaxRequest() == true ? 'api' : 'montador', {html: 'landpage/table_price', data: data, usuario: req.session.usuario});


		}).sort({'_id':-1});

	}).sort({'_id':-1}).limit(1);


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


module.exports = router;