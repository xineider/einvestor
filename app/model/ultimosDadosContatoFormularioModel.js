var mongoose = require('mongoose');

const ultimos_dadosSchema = new mongoose.Schema({
	nome:String,
	email:String,
	telefone:String,
	como_chegou:String,
	acess_key:String,
	responsavel_legal:String,
	aluguel:Number,
	capital:Number,
	algoritmo:Number,
	algoritmo_show:Number,
	rentabilidade_aa:Number,
	tipo_usuario:String,
	deletado:Boolean,
	data_cadastro:Date
});

module.exports = mongoose.model('ultimos_dados_contato_formulario', ultimos_dadosSchema,'ultimos_dados_contato_formulario');