'use strict';

angular.module('builds').directive('itemSection', [
    function() {
        return {
            templateUrl: 'modules/builds/views/item-section.client.view.html',
            restrict: 'E',
            scope: {
                data: 	'=',
                build: 	'='
            },
            controller: function($scope){


                $scope.init = function(){
                    if ($scope.build.snapshot.length == 0)
                        $scope.addSnapshot();

                    // Control var to check if GoldBase item has been set.
                    $scope.data.goldBase = {
                        id: 0,
                        isSet: false
                    };

                    // ID's of items that require the current champion.
                    // Must be updated if the champion changes.
                    $scope.data.championItems = [];
                };

                $scope.search = {
                    name: null
                };

                $scope.itemSearch = {
                    name: "",
                    tags: []
                };

                $scope.addSnapshot = function(){
                    var statTmp =  {
                        hp: 'n/a',
                        mp: 'n/a',
                        hpregen: 'n/a',
                        mpregen: 'n/a',
                        attackdamage: 'n/a',
                        abilitypower: 'n/a',
                        armorpenetration: ['n/a','n/a'],
                        magicpenetration:  ['n/a','n/a'],
                        lifesteal: 'n/a',
                        spellvamp: 'n/a',
                        attackspeed: 'n/a',
                        cooldownreduction: 'n/a',
                        critchance: 'n/a',
                        armor: 'n/a',
                        attackrange: 'n/a',
                        spellblock: 'n/a',
                        movespeed: 'n/a',
                        tenacity: 'n/a'
                    };

                    var snapTmp = {
                        level: 	1,
                        items:  [],
                        name: 	''
                    };

                    $scope.build.snapshot.push(snapTmp);
                    $scope.build.calculatedStats.push(statTmp);
                    var length = $scope.build.snapshot.length-1;
                    $scope.setCurrentSnap(length);
                };

                $scope.setCurrentSnap = function(index){
                    $scope.data.currentSnapshot = index;
                };

                $scope.addItem = function(item){
                    // Check if there is a free slot for another item.
                    if ( $scope.build.snapshot[$scope.data.currentSnapshot].items.length < 6) {
                        // Check if the item belongs to group GoldBase and is the first one being set.
                        if (!item.group || item.group === "GoldBase" && !$scope.data.goldBase.isSet) {
                            var name = $scope.data.selectedChampion.name;

                            // Warn the user if he tries to select another champion's item.
                            if (typeof item.requiredChampion !== 'undefined' && item.requiredChampion !== name) {
                                // TODO: Warn user about using items for the wrong champion.
                                console.log("That item can't be used on the selected champion!");
                            } else {
                                // If the item requires the current champion, add it to championItems.
                                if (typeof item.requiredChampion !== 'undefined') {
                                    $scope.data.championItems.push(item.id);
                                }

                                $scope.build.snapshot[$scope.data.currentSnapshot].items.push({id:item.id, customEffect: item.customEffect});
                                $scope.data.goldBase.id = item.id;
                                $scope.data.goldBase.isSet = true;
                            }
                        } else {
                            // TODO: Warn user about using multiple gold items.
                            console.log("Only one gold item allowed!");
                        }
                    }
                };

                $scope.removeItem = function(index){
                    var id = $scope.build.snapshot[$scope.data.currentSnapshot].items[index].id;

                    $scope.build.snapshot[$scope.data.currentSnapshot].items.splice(index,1);

                    // If this item is the one that set GoldBase, unset GoldBase.
                    if ($scope.data.goldBase.isSet && $scope.data.goldBase.id == id) {
                        $scope.data.goldBase.isSet = false;
                    }

                    // If this is a champion item, remove it from championItems
                    var itemIndex = $scope.data.championItems.indexOf(id);
                    if (itemIndex > -1) {
                        $scope.data.championItems.splice(itemIndex, 1);
                    }
                };

                $scope.toggleItemTag = function(tag) {
                    var idx = $scope.itemSearch.tags.indexOf(tag);

                    // is currently selected
                    if (idx > -1) {
                        $scope.itemSearch.tags.splice(idx, 1);
                    } else {
                        $scope.itemSearch.tags.push(tag);
                    }
                };

                $scope.itemFilterEnabled = function(tag) {
                    return ($scope.itemSearch.tags.indexOf(tag) > -1);
                };

                $scope.range = function(min, max, step){
                    step = step || 1;
                    var input = [];
                    for (var i = min; i <= max; i += step) input.push(i);
                    return input;
                };

                $scope.filterFunction = function(element) {
                    if ($scope.search.name === null) return true;
                    return element.name.toLowerCase().indexOf($scope.search.name.toLowerCase()) > -1;
                };

                /**
                 * Listen for any champion change and update the items when necessary.
                 */
                $scope.$watch('data.selectedChampion', function(newValue, oldValue) {
                    // newValue/oldValue: champion data object

                    // Remove all items related to the previous champion.
                    if (oldValue != null && newValue != null && newValue.id != oldValue.id) {
                        var items = $scope.build.snapshot[$scope.data.currentSnapshot].items;
                        for (var i = $scope.data.championItems.length - 1; i >= 0; i--) {
                            for (var c = items.length-1; c >= 0; c--) {
                                if (items[c].id === $scope.data.championItems[i]) {
                                    items.splice(c, 1);
                                }
                            }
                            $scope.data.championItems.splice(i, 1);
                        }
                    }
                });
            }
        };
    }
]);
