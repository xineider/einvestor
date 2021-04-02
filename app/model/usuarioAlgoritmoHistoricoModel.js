var mongoose = require('mongoose');

const usuarioAlgoritmoHistoricoSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	mes:String,
	porcentagem:Number,
	numero_operacoes:Number,
	valor: Number,
	deletado:Boolean
});

module.exports = mongoose.model('usuario_algoritmo_historico', usuarioAlgoritmoHistoricoSchema,'usuario_algoritmo_historico');