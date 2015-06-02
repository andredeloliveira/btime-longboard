'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Etapa = mongoose.model('Etapa'),
	_ = require('lodash');

/**
 * Create a Etapa
 */
exports.create = function(req, res) {
	var etapa = new Etapa(req.body);
	etapa.user = req.user;

	etapa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(etapa);
		}
	});
};

/**
 * Show the current Etapa
 */
exports.read = function(req, res) {
	res.jsonp(req.etapa);
};

/**
 * Update a Etapa
 */
exports.update = function(req, res) {
	var etapa = req.etapa ;

	etapa = _.extend(etapa , req.body);

	etapa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(etapa);
		}
	});
};

/**
 * Delete an Etapa
 */
exports.delete = function(req, res) {
	var etapa = req.etapa ;

	etapa.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(etapa);
		}
	});
};

/**
 * List of Etapas
 */
exports.list = function(req, res) { 
	Etapa.find().sort('-created').populate('user', 'displayName').exec(function(err, etapas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(etapas);
		}
	});
};

/**
 * Etapa middleware
 */
exports.etapaByID = function(req, res, next, id) { 
	Etapa.findById(id).populate('user', 'displayName').exec(function(err, etapa) {
		if (err) return next(err);
		if (! etapa) return next(new Error('Failed to load Etapa ' + id));
		req.etapa = etapa ;
		next();
	});
};

/**
 * Etapa authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.etapa.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
