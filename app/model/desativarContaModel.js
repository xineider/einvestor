var mongoose = require('mongoose');

const desativarContaSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	desativar:Boolean
});

module.exports = mongoose.model('desativar_conta', desativarContaSchema,'desativar_conta');