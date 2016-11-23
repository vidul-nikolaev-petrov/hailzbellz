// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ionic.utils', 'starter.controllers', 'starter.services'])

.run(function (
    $localstorage,
    $rootScope,
    hailzbellzScope,
    hailzbellzServices,
    hailzbellzSettings) {

    ionic.Platform.ready(function () {
        var settings = hailzbellzSettings.getSettings();

        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        hailzbellzScope.paused = false;

        if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

            // document.addEventListener('pause', stopShake, false);
            // document.addEventListener('resume', startShake, false);

            cordova.plugins.backgroundMode.setDefaults({
                text: 'Background mode is enabled.',
                ticker: 'Hailzbells in background mode',
                title: 'Hailzbells',
            });

            window.powerManagement.dim(
                function () {
                    console.log('Wakelock acquired');
                },
                function () {
                    console.log('Failed to acquire wakelock');
                });

            window.powerManagement.setReleaseOnPause(false,
                function () {
                    console.log('setReleaseOnPause successfully');
                },
                function () {
                    console.log('Failed to set');
                });

            loadSoundPlayer();
            loadSoundPlayerSample();

            cordova.plugins.backgroundMode.enable();
            cordova.plugins.backgroundMode.onactivate = function () {
                if (hailzbellzScope.playing) {
                    stopSoundPlayer();
                    hailzbellzScope.playing = false;
                    $rootScope.$broadcast('playing:stop');
                }
            };

            // Start watching for shake gestures and call "onShake"
            // with a shake sensitivity of 40 (optional, default 30)
            startShake();

            function loadSoundPlayer() {
                window.plugins.NativeAudio
                    .preloadComplex('audio',
                        hailzbellzServices.soundUrls(),
                        settings.volume, 1, 0,

                        function (msg) {
                            console.log('loading:', msg);
                        },
                        function (error) {
                            console.log('error:', error);
                        });
            }

            function loadSoundPlayerSample() {
                window.plugins.NativeAudio
                    .preloadComplex('audio_sample',
                        hailzbellzServices.soundUrlsSample(),
                        settings.volume, 1, 0,

                        function (msg) {
                            console.log('loading:', msg);
                        },
                        function (error) {
                            console.log('error:', error);
                        });
            }

            function stopSoundPlayer() {
                window.plugins.NativeAudio.stop('audio', null, null);
            }

            function startSoundPlayer() {
                hailzbellzServices.soundPlay();
            }

            function unloadSoundPlayer() {
                window.plugins.NativeAudio.unload('audio', null, null);
            }

            function stopShake() {
                shake.stopWatch();
            }

            function startShake() {
                var settings = hailzbellzSettings.getSettings();

                shake.startWatch(hailzbellzServices.soundPlay, settings.shake);
            }
        }

    });
})

.config(function ($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s(file|blob|cdvfile):|data:image\//);
});
