'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Marca Schema
 */
var MarcaSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Por favor, preencha o nome da Marca',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Marca', MarcaSchema);