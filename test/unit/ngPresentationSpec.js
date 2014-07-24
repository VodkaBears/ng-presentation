'use strict';

/**
 * Some unit tests
 */
describe('ngPresentation', function () {
    beforeEach(module('ngPresentation'));

    beforeEach(module('templates/ng-presentation.html', 'templates/ng-presentation.html'));

    var element, scope;

    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;
        scope.slides = [
            {
                title: 'Синдром Стендаля',
                content: '<pre></pre>',
                style: {'line-height': '1000px'},
                class: ''
            },
            {
                title: 'Синдром Ван Гога',
                content: 'Этот синдром выражается в том, что больной очень настаивает на операции или даже — о ужас — оперирует себя сам.',
                style: {'background': '#e67e22'},
                class: ''
            }
        ];

        element = angular.element('<div ng-presentation slides="slides"></span>');
        $compile(element)(scope);
        scope = element.scope();
        return scope.$apply();
    }));

    it('should have visible first slide', function () {
        expect(scope.slides[0].visible).toBe(true);
    });

    it('should change slides if next button was clicked', function () {
        element.find('.ng-presentation-ctrls-next').click();
        expect(scope.slides[0].visible).toBe(false);
        expect(scope.slides[1].visible).toBe(true);

        element.find('.ng-presentation-ctrls-next').click();
        expect(scope.slides[0].visible).toBe(true);
        expect(scope.slides[1].visible).toBe(false);
    });

    it('should change slides if back button was clicked', function () {
        element.find('.ng-presentation-ctrls-prev').click();
        expect(scope.slides[0].visible).toBe(false);
        expect(scope.slides[1].visible).toBe(true);

        element.find('.ng-presentation-ctrls-prev').click();
        expect(scope.slides[0].visible).toBe(true);
        expect(scope.slides[1].visible).toBe(false);
    });

    it('should change the page number', function () {
        expect(element.find('.ng-presentation-ctrls-number').text()).toBe("1");
        element.find('.ng-presentation-ctrls-next').click();
        expect(element.find('.ng-presentation-ctrls-number').text()).toBe("2");
        element.find('.ng-presentation-ctrls-next').click();
        expect(element.find('.ng-presentation-ctrls-number').text()).toBe("1");
        element.find('.ng-presentation-ctrls-prev').click();
        expect(element.find('.ng-presentation-ctrls-number').text()).toBe("2");
    });

    it('should support html content', function () {
        expect(element.find('.ng-presentation-slide-content-html').eq(0).html()).toBe("<pre></pre>");
    });

    it('should support slyles', function () {
        expect(element.find('.ng-presentation-slide').css("line-height")).toBe("1000px");
    });
});

