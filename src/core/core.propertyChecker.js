// Core.deprecated.js
// Implements a system for registering checks that will run over the properties

(function() {
	var root = this,
		Chart = root.Chart,
		helpers = Chart.helpers;

	var ETypes = {
		log: 'log',
		warning: 'warning',
		error: 'error'
	};

	if (Object.freeze) {
		Object.freeze(ETypes);
	}

	Chart.propertyChecker = {
		propertyChecks: [],

		// Register a function to be called when options are checked
		// The function takes a single option, the config.
		// It must return an array of errors. Errors should be created using generateWarning / generateError
		registerCheck: function(checkFunction) {
			this.propertyChecks.push(checkFunction);
		},

		// Check the given properties object for deprecated options.
		// @param {object} config : the config object to check
		// @return {array} : messages. Should then be passed to notifyPropertyErrors
		checkConfig: function(config) {
			var errors = [];

			helpers.each(this.propertyChecks, function(checkFunction) {
				var checkFunctionErrors = checkFunction(config);

				if (helpers.isArray(checkFunctionErrors) && checkFunctionErrors.length > 0) {
					// Move to our array
					Array.prototype.push.apply(errors, checkFunctionErrors);
				}
			});

			return errors;
		},

		// Notify the user that there are config problems
		notifyPropertyErrors: function(errors) {
			helpers.each(errors, function(error) {
				if (error.type === ETypes.log) {
					helpers.log(error.message);
				} else if (error.type === ETypes.warning) {
					helpers.warn(error.message);
				} else if (error.type === ETypes.error) {
					helpers.error(error.message);
				} 
			});
		},

		// generate a log object
		generateLog: function(message) {
			return {
				type: ETypes.log,
				message: message,
			};
		},

		// generate a warning object
		generateWarning: function(message) {
			return {
				type: ETypes.warning,
				message: message,
			};
		},
		// generate an error object
		generateError: function(message) {
			return {
				type: ETypes.error,
				message: message,
			};
		},
	};
}).call(this);