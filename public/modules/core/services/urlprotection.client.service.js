'use strict';

angular.module('core').factory('Urlprotection', [
	function() {
		// Public API
		return {
			checkSendToHome: function($q, Authentication, $state, $timeout) {
				if (angular.isDefined(Authentication) && Authentication.user) {
					// Resolve the promise successfully
					return $q.when();
				} else {

					// The next bit of code is asynchronously tricky.
					$timeout(function() {
						// This code runs after the authentication promise has been rejected.
						// Go to the log-in page
						$state.go('teaser');
					})

					// Reject the authentication promise to prevent the state from loading
					return $q.reject();
				}
			}
		};
	}
]);