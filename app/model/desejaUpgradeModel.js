var mongoose = require('mongoose');

const desejaUpgradeSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	capital:Number,
	algoritmo:Number,
	rentabilidade_aa:Number,
	deletado:Boolean,
	data_cadastro:Date
});

module.exports = mongoose.model('deseja_upgrade', desejaUpgradeSchema,'deseja_upgrade');