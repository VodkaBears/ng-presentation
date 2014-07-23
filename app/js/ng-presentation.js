(function (angular) {
    'use strict';

    var app = angular.module('ngPresentation', ['ngAnimate']);

    app.directive('ngPresentation', function ($document, $timeout) {
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
                slides: '='
            },
            link: function(scope, element, attrs) {
                var timeout;
                scope.currentIndex = 0;
                scope.isPaused = true;
                scope.isFullscreen = false;

                currentScope = scope;

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
                        }, 3000);
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
                        }, 3000);
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
                    var isReallyFullScreen = !!(document.fullScreen || document.mozFullScreen ||
                        document.webkitIsFullScreen || document.msFullscreenElement);

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
                scope.$on('$destroy', function() {
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
