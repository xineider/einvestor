var mongoose = require('mongoose');

const usuarioRoboSchema = new mongoose.Schema({
	id_usuario:mongoose.Types.ObjectId,
	id_robo:mongoose.Types.ObjectId,
	rentabilidade_aa:Number
});

module.exports = mongoose.model('usuario_robo', usuarioRoboSchema,'usuario_robo');