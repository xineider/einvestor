var mongoose = require('mongoose');

const licencaSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	data_fim: Date,
	deletado:Boolean,
	data_cadastro:Date
});

module.exports = mongoose.model('licenca', licencaSchema,'licenca');