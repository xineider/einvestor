var mongoose = require('mongoose');

const usuarioDadosSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	numero_operacoes:Number,
	sistema_online:Boolean,
	pagamento:Boolean
});

module.exports = mongoose.model('usuario_dados', usuarioDadosSchema,'usuario_dados');