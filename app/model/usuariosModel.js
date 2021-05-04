var mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
	nome: String,
	email:String,
	senha:String,
	telefone:String,
	foto:String,
	cpf:String,
	nivel: Number,
	gratis:Boolean,
	deletado:Boolean,
	data_cadastro:Date
});

module.exports = mongoose.model('Usuarios', usuarioSchema,'usuarios');