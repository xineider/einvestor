var mongoose = require('mongoose');

const usuarioAlgoritmoSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	mes:String,
	porcentagem:Number,
	valor: Number,
	deletado:Boolean
});

module.exports = mongoose.model('usuario_algoritmo', usuarioAlgoritmoSchema,'usuario_algoritmo');