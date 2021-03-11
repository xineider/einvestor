var mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	email:String,
	senha:String,
	validado: Boolean,
	testado:Boolean,
	deletado:Boolean
});

module.exports = mongoose.model('usuario_corretora', usuarioSchema,'usuario_corretora');