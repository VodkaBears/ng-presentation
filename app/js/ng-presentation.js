(function (angular) {
    'use strict';

    var app = angular.module('ngPresentation', []);

    app.directive('ngPresentation', function ($document, $sce, $timeout) {
        var currentScope;

        /**
         * Add keyboard control to the focused(last used) presentation
         */
        $document.on('keydown', function (e) {
            if (!currentScope) {
                return;
            }

            var keyCode = e.keyCode;
            if (keyCode === 37) {
                currentScope.$apply(function () {
                    currentScope.prev();
                });
            } else if (keyCode === 39) {
                currentScope.$apply(function () {
                    currentScope.next();
                });
            }
        });

        return {
            restrict: 'AE',
            replace: true,
            scope: {
                slides: '=',
                playbackDelay: '@playbackdelay'
            },
            link: function (scope, element, attrs) {
                var timeout,
                    playbackDelay = scope.playbackDelay ? parseInt(scope.playbackDelay) : 6000;
                scope.currentIndex = 0;
                scope.isPaused = true;
                scope.isFullscreen = false;
                currentScope = scope;

                // Check full screen support
                scope.isFullscreenAvailable = !!(document.fullscreenEnabled ||
                    document.mozFullScreenEnabled ||
                    document.webkitFullscreenEnabled ||
                    document.msFullscreenEnabled);

                // Pass html to the template
                scope.slides.forEach(function (slide) {
                    slide.content = $sce.trustAsHtml(slide.content);
                });

                /**
                 * Next slide
                 */
                scope.next = function () {
                    scope.currentIndex < scope.slides.length - 1 ?
                        scope.currentIndex++ : scope.currentIndex = 0;

                    // Reset timer time
                    if (!scope.isPaused) {
                        $timeout.cancel(timeout);
                        timeout = $timeout(function () {
                            scope.next();
                        }, playbackDelay);
                    }
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
                        timeout = $timeout(function () {
                            scope.next();
                        }, playbackDelay);
                    } else {
                        $timeout.cancel(timeout);
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
                        } else if (elem.msRequestFullscreen) {
                            elem.msRequestFullscreen();
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

                /**
                 * Look for the currentIndex to hide/show slides
                 */
                scope.$watch('currentIndex', function (newIndex, oldIndex) {
                    scope.slides[oldIndex].visible = false;
                    scope.slides[newIndex].visible = true;
                });

                /**
                 * Check full screen mode and update scope value
                 * @param e - event
                 */
                var checkFullscreen = function (e) {
                    var isReallyFullScreen = !!(document.fullscreenElement ||
                        document.mozFullScreenElement ||
                        document.webkitFullscreenElement ||
                        document.msFullscreenElement);

                    scope.$apply(function () {
                        scope.isFullscreen = isReallyFullScreen;
                    });
                };
                $document.bind('fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange',
                    checkFullscreen);

                /**
                 * Focus element on click
                 */
                var focusElement = function () {
                    currentScope = scope;
                };
                element.on('click', focusElement);

                /**
                 * Destroy directive
                 */
                scope.$on('$destroy', function () {
                    if (timeout) {
                        $timeout.cancel(timeout);
                    }

                    $document.unbind('fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange',
                        checkFullscreen);

                    element.unbind('click', focusElement);
                });

            },
            templateUrl: 'templates/ng-presentation.html'
        };
    });
})(angular);
