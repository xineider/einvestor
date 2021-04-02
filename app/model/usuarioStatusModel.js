var mongoose = require('mongoose');

const usuarioStatusSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	numero_operacoes:Number,
	sistema_online:Boolean,
	nome_algoritmo_escolhido:String,
	valor_aplicado:Number,
	pagamento:Boolean,
	conta:String,
	algoritmo:String,
	aceite_termos_inicio:Boolean,
	deletado:Boolean,
	data_atualizacao:Date,
	data_cadastro:Date
});

module.exports = mongoose.model('usuario_status', usuarioStatusSchema,'usuario_status');