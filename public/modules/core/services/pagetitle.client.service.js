'use strict';

angular.module('core').factory('Pagetitle', [
	function() {
		var title, base_title = 'OfftheRift';
		return {
			title: function() {
				return title;
			},
			setTitle: function(newTitle) {
				title = newTitle + " | " + base_title;
				return title;
			}
		};
	}
]);