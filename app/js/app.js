(function () {
    var app = angular.module('presentationApp', ['ngPresentation']);

    app.controller('presentationCtrl', function ($scope) {
        $scope.slides = [{
            title: 'Slide 1',
            content: 'This is slide №1',
            style: {'background': '#e74c3c'},
            class: ''
        }, {
            title: 'Slide 2',
            content: 'This is slide №2',
            style: {'background': '#e67e22'},
            class: ''
        }, {
            title: 'Slide 3',
            content: 'This is slide №3',
            style: {'background': '#1abc9c'},
            class: ''
        }, {
            title: 'Slide 4',
            content: 'This is slide №4',
            style: {'background': '#3498db'},
            class: ''
        }, {
            title: 'Slide 5',
            content: 'This is slide №5',
            style: {'background': '#9b59b6'},
            class: ''
        }];
    });
})(angular);
