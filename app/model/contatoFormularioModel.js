var mongoose = require('mongoose');

const contatoFormularioSchema = new mongoose.Schema({
	nome:String,
	email:String,
	telefone:String,
	como_chegou:String,
	investe_em_renda_variavel:String,
	pretencao_investimento:String,
	deletado:Boolean,
	data_cadastro:Date
});

module.exports = mongoose.model('contato_formulario', contatoFormularioSchema,'contato_formulario');