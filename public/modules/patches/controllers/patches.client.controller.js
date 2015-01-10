'use strict';

// Patches controller
angular.module('patches').controller('PatchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Patches','Repository',
	function($scope, $stateParams, $location, Authentication, Patches, Repository) {
		$scope.authentication = Authentication;

		// Create new Patch
		/*$scope.create = function() {
			// Create new Patch object
			var patch = new Patches.model ({
				name: this.name
			});

			// Redirect after save
			patch.model.$save(function(response) {
				$location.path('patches/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Patch
		$scope.remove = function(patch) {
			if ( patch ) { 
				patch.model.$remove();

				for (var i in $scope.patches) {
					if ($scope.patches [i] === patch) {
						$scope.patches.splice(i, 1);
					}
				}
			} else {
				$scope.patch.model.$remove(function() {
					$location.path('patches');
				});
			}
		};

		// Update existing Patch
		$scope.update = function() {
			var patch = $scope.patch;

			patch.model.$update(function() {
				$location.path('patches/' + patch._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};*/

		// Find a list of Patches
		$scope.find = function() {
			$scope.patches = Repository.getPatches();
		};

		// Find existing Patch
		/*$scope.findOne = function() {
			$scope.patch = Patches.getPatchById($stateParams.patchId);
		};*/

		/**
		 * Toggle Enabled
		 * @param  {boolean} attr Boolean
		 */
		$scope.toggleEnabled = function (patch) {
			patch.enabled = !patch.enabled;
		}

		$scope.synchPatch = function (patch) {
			patch.synched = true;
			// @TODO: Synch method DD
		}

		/**
		 * Ask server to check for new patches
		 * @return {[type]} [description]
		 */
		$scope.checkPatches = function(){
			Patches.checkPatches.get(function(res){
				$scope.patches = Repository.getPatches(res.force);
			});
		}
	}
]);