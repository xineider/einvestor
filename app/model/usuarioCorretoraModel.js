var mongoose = require('mongoose');

const usuarioCorretoraSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	email:String,
	senha:String,
	nova_senha:String,
	corretora:String,
	validado: Boolean,
	sincronizado:Boolean,
	deletado:Boolean
});

module.exports = mongoose.model('usuario_corretora', usuarioCorretoraSchema,'usuario_corretora');