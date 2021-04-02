var mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
	_id:mongoose.Types.ObjectId,
	id_parceiro:mongoose.Types.ObjectId,
	nome: String,
	email:String,
	senha:String,
	nivel: Number,
	cpf:String,
	deletado:Boolean
});

module.exports = mongoose.model('Usuarios', usuarioSchema,'usuarios');