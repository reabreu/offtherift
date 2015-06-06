'use strict';

angular.module('core').factory('Metainformation', [
	function() {
		var metaDescription = '';
		var metaKeywords 	= '';
		var defaultKeywords = 'Offtherift, Builds, League of Legends, Champion, Gaming';
		return {
			metaDescription: function() { return metaDescription; },
			metaKeywords: function() {
				if(metaKeywords == "")
					return defaultKeywords;
				else
					return metaKeywords;
			},
			reset: function() {
				metaDescription = '';
				metaKeywords 	= '';
			},
			setMetaDescription: function(newMetaDescription) {
				metaDescription = newMetaDescription;
			},
			appendMetaKeywords: function(newKeywords) {
				for (var i = newKeywords.length - 1; i >= 0; i--) {
					if (metaKeywords === '') {
						metaKeywords += newKeywords[i];
					} else {
						metaKeywords += ', ' + newKeywords[i];
					}
				}
			}
		};
	}
]);