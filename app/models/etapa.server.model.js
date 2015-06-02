'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Etapa Schema
 */
var EtapaSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Etapa name',
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

mongoose.model('Etapa', EtapaSchema);