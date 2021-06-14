var mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
	nome: String,
	email:String,
	senha:String,
	telefone:String,
	foto:String,
	cpf:String,
	cnpj:String,
	responsavel_legal:String,
	nivel: Number,
	gratis:Boolean,
	licenca_pedido_ativacao:Boolean,
	deletado:Boolean,
	data_cadastro:Date
});

module.exports = mongoose.model('Usuarios', usuarioSchema,'usuarios');