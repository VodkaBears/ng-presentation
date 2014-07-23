(function () {
    var app = angular.module('presentationApp', ['ngPresentation']);

    app.controller('presentationCtrl', function ($scope) {
        $scope.slides = [{
            title: 'Slide 1',
            content: 'This is slide №1',
            background: '#e74c3c'
        }, {
            title: 'Slide 2',
            content: 'This is slide №2',
            background: '#e67e22'
        }, {
            title: 'Slide 3',
            content: 'This is slide №3',
            background: '#1abc9c'
        }, {
            title: 'Slide 4',
            content: 'This is slide №4',
            background: '#3498db'
        }, {
            title: 'Slide 5',
            content: 'This is slide №5',
            background: '#9b59b6'
        }];
    });
})(angular);
