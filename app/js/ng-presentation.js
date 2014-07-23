(function (angular) {
    'use strict';

    var app = angular.module('ngPresentation', ['ngAnimate']);

    app.directive('ngPresentation', function ($document, $interval) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                slides: '='
            },
            link: function(scope, element, attrs) {
                var interval;
                scope.currentIndex = 0;
                scope.isPaused = true;
                scope.isFullscreen = false;

                /**
                 * Check full screen mode and update scope value
                 * @param e - event
                 */
                var checkFullscreen = function (e) {
                    var isReallyFullScreen = !!(document.fullScreen || document.mozFullScreen ||
                        document.webkitIsFullScreen || document.msFullscreenElement);

                    scope.$apply(function () {
                        scope.isFullscreen = isReallyFullScreen;
                    });
                };

                /**
                 * Next slide
                 */
                scope.next = function () {
                    scope.currentIndex < scope.slides.length - 1 ?
                        scope.currentIndex++ : scope.currentIndex = 0;
                };

                /**
                 * Previous slide
                 */
                scope.prev = function () {
                    scope.currentIndex > 0 ?
                        scope.currentIndex-- : scope.currentIndex = scope.slides.length - 1;
                };

                /**
                 * Play/pause
                 */
                scope.play = function () {
                    if (scope.isPaused) {
                        interval = $interval(function () {
                            scope.next();
                        }, 3000);
                    } else {
                        $interval.cancel(interval);
                    }

                    scope.isPaused = !scope.isPaused;
                };

                /**
                 * Go to the full screen mode/ exit from the full screen mode
                 */
                scope.fullscreen = function () {
                    var elem = element[0],
                        isFullScreen = !!(document.fullscreenElement ||
                            document.mozFullScreenElement ||
                            document.webkitFullscreenElement ||
                            document.msFullscreenElement);

                    if (!isFullScreen) {
                        if (elem.requestFullscreen) {
                            elem.requestFullscreen();
                        } else if (elem.mozRequestFullScreen) {
                            elem.mozRequestFullScreen();
                        } else if (elem.webkitRequestFullscreen) {
                            elem.webkitRequestFullscreen();
                        }
                    } else {
                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        } else if (document.msExitFullscreen) {
                            document.msExitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                            document.mozCancelFullScreen();
                        } else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        }
                    }
                };

                $document.bind('fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange',
                    checkFullscreen);

                scope.$on('$destroy', function() {
                    if (interval) {
                        $interval.cancel(interval);
                    }

                    $document.unbind('fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange',
                        checkFullscreen);
                });

                scope.$watch('currentIndex', function (newIndex, oldIndex) {
                    scope.slides[oldIndex].visible = false;
                    scope.slides[newIndex].visible = true;
                });
            },
            templateUrl: 'templates/ng-presentation.html'
        };
    });
})(angular);
