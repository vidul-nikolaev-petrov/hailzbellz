angular.module('starter.services', ['ionic'])

.service('hailzbellzServices', function ($rootScope, hailzbellzConstants, hailzbellzScope) {

    function soundUrls() {
        var file_path = hailzbellzConstants.sound_path_cowbell;

        if (ionic.Platform.isAndroid()) {
            return file_path;
        }
        else {
            return [file_path];
        }
    }

    function soundUrlsSample() {
        var file_path = hailzbellzConstants.sound_path_sample;

        if (ionic.Platform.isAndroid()) {
            return file_path;
        }
        else {
            return [file_path];
        }
    }

    function soundPlay() {
        if (hailzbellzScope.paused) return;
        if (hailzbellzScope.playing) return;

        hailzbellzScope.playing = true;

        $rootScope.$broadcast('playing:start');

        if (ionic.Platform.isAndroid()) {
            // window.plugins.NativeAudio.stop('audio', null, null);
            window.plugins.NativeAudio.play('audio',
                function (msg) {
                    console.log('playing:', msg);
                },
                function (error) {
                    console.log('error:', error);
                },
                function (msg) {
                    console.log('complete:', msg);
                    hailzbellzScope.playing = false;
                    $rootScope.$broadcast('playing:stop');
                });
        }
        else {
            new Howl({
                urls: soundUrlsSample(),
                onend: function () {
                    this.unload();
                    hailzbellzScope.playing = false;
                    $rootScope.$broadcast('playing:stop');
                },
            }).play();
        }
    }

    function soundPause() {
        if (ionic.Platform.isAndroid()) {
            window.plugins.NativeAudio.stop('audio', null, null);
        }
    }

    return {
        soundPlay: soundPlay,
        soundPause: soundPause,
        soundUrls: soundUrls,
        soundUrlsSample: soundUrlsSample,
    };
})

.service('hailzbellzSettings', function ($localstorage, hailzbellzConstants, hailzbellzServices) {

    function getSettings() {
        var settings = $localstorage.getObject('settings'),
            default_shake = hailzbellzConstants.default.shake,
            default_volume = hailzbellzConstants.default.volume,
            shake_top = hailzbellzConstants.default.shake_top;

        settings.shake = shake_top - Number(settings.shake || default_shake);
        settings.volume = Number(settings.volume || default_volume);

        return settings;
    }

    function setShake() {
        var settings = getSettings();

        if (ionic.Platform.isAndroid()) {
            shake.stopWatch();
            shake.startWatch(hailzbellzServices.soundPlay, settings.shake);
        }
    }

    function setVolume() {
        var settings = getSettings();

        if (ionic.Platform.isAndroid()) {
            window.plugins.NativeAudio.setVolumeForComplexAsset(
                'audio', settings.volume);

            window.plugins.NativeAudio.stop('audio_sample', null, null);
            window.plugins.NativeAudio.setVolumeForComplexAsset(
                'audio_sample', settings.volume,
                function () {
                    window.plugins.NativeAudio.play('audio_sample');
                });
        }
    }

    return {
        getSettings: getSettings,
        setShake: setShake,
        setVolume: setVolume,
    };
})

.factory('hailzbellzScope', function () {
    return {};
})

.constant('hailzbellzConstants', {
    default: {
        shake: 35,
        shake_top: 50,
        volume: 1,
    },
    sound_path_cowbell: 'sound/cowbell.mp3',
    sound_path_sample: 'sound/sample.mp3',
});
