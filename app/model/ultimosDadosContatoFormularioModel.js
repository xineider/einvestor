var mongoose = require('mongoose');

const ultimos_dadosSchema = new mongoose.Schema({
	nome:String,
	email:String,
	telefone:String,
	como_chegou:String,
	acess_key:String,
	capital:Number,
	algoritmo:Number,
	deletado:Boolean,
	data_cadastro:Date
});

module.exports = mongoose.model('ultimos_dados_contato_formulario', ultimos_dadosSchema,'ultimos_dados_contato_formulario');