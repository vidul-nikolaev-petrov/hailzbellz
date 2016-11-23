angular.module('starter.controllers', [])

.controller('MainController', function (
    $ionicModal,
    $localstorage,
    $scope,
    hailzbellzConstants,
    hailzbellzScope,
    hailzbellzServices,
    hailzbellzSettings) {

    $scope.model = {};

    $scope.$on('playing:start', function () {
        if (!$scope.$$phase) {
            $scope.$apply(function () {
                $scope.model.playing = true;
            });
        }
    });

    $scope.$on('playing:stop', function () {
        $scope.$apply(function () {
            $scope.model.playing = false;
        });
    });

    $scope.settings = $localstorage.getObject('settings');

    if (!$scope.settings.volume) {
        $scope.settings.volume = hailzbellzConstants.default.volume;
    };

    if (!$scope.settings.shake) {
        $scope.settings.shake = hailzbellzConstants.default.shake;
    };

    $scope.pause = function () {
        $scope.model.pause = hailzbellzScope.paused = !hailzbellzScope.paused;
    };

    $scope.play = function () {
        hailzbellzServices.soundPlay();
    };

    $scope.setVolume = function () {
        $localstorage.setObject('settings', $scope.settings);
        hailzbellzSettings.setVolume();
    };

    $scope.setShake = function () {
        $localstorage.setObject('settings', $scope.settings);
        hailzbellzSettings.setShake();
    };

    $ionicModal.fromTemplateUrl('modal-about.html', {
            scope: $scope,
        })
        .then(
            function (response) {
                $scope.modal_about = response;
            });

    $ionicModal.fromTemplateUrl('modal-settings.html', {
            scope: $scope,
        })
        .then(
            function (response) {
                $scope.modal_settings = response;
            });
});
