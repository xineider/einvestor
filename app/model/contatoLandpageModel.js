var mongoose = require('mongoose');

const contatoLandpageSchema = new mongoose.Schema({
	nome:String,
	empresa:String,
	telefone:String,
	email:String,
	como_chegou:String,
	qual_sua_necessidade:String,
	deletado:Boolean,
	data_cadastro:Date
});

module.exports = mongoose.model('contato_landpage', contatoLandpageSchema,'contato_landpage');