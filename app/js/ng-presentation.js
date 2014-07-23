(function (angular) {
    'use strict';

    var app = angular.module('ngPresentation', ['ngAnimate']);

    app.directive('ngPresentation', function ($interval) {
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

                scope.next = function () {
                    scope.currentIndex < scope.slides.length - 1 ?
                        scope.currentIndex++ : scope.currentIndex = 0;
                };

                scope.prev = function () {
                    scope.currentIndex > 0 ?
                        scope.currentIndex-- : scope.currentIndex = scope.slides.length - 1;
                };

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

                scope.fullscreen = function () {
                    var elem = element[0];

                    console.log(elem.mozCancelFullScreen);

                    if (!scope.isFullscreen) {
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

                    scope.isFullscreen = !scope.isFullscreen;
                };

                scope.$on('$destroy', function() {
                    if (interval) {
                        $interval.cancel(interval);
                    }
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
