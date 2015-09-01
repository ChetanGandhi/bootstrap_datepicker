'use strict';

(function(angular)
{
    angular.module('sample.datepicker', ['ui.bootstrap']).config(['$provide', Decorate]);

    function Decorate($provide)
    {
        $provide.decorator('datepickerDirective', function($delegate)
        {
            var directive = $delegate[0];
            directive.templateUrl = function(element, attrs)
            {
                return attrs.templateUrl || "templates/datepickerOverride.tpl.html";
            };

            var scopeExtension = {
                tooltipProvider: '&',
                tooltipEnabled: '='
            };

            angular.forEach(scopeExtension, function (value, key) {
              $delegate[0].$$isolateBindings[key] = {
                attrName: key,
                mode: value,
                optional: true
            };
        });

            return $delegate;
        });

        $provide.decorator('daypickerDirective', function($delegate)
        {
            var directive = $delegate[0];
            directive.templateUrl = function(element, attrs)
            {
                return attrs.templateUrl || "templates/daypickerOverride.tpl.html";
            }
            return $delegate;
        });
    }

    angular.module('ui.bootstrap.datepicker').directive('dayButton', function()
    {
        var link = function(scope, element, attrs, ctrl)
        {
            if(scope.tooltipEnabled)
            {
                $("[data-toggle='tooltip']").tooltip({
                    title: function()
                    {
                        return scope.tooltipProvider(scope.dt);
                    },
                    placement: "bottom",
                    trigger: "hover"
                });
            }
        };

        return {
            link: link,
            templateUrl: function(element, attrs)
            {
                return attrs.templateUrl || "templates/dayButton.tpl.html";
            }
        };
    });

    angular.module('sample.datepicker').directive('datepickerWrapper', function()
    {
        var link = function(scope, element, attrs, ctrl) {};

        return {
            link: link,
            templateUrl: "templates/datepickerWrapper.tpl.html"
        };
    });

    angular.module('sample.datepicker').controller('datePickerSampleController', function($scope)
    {
        $scope.tooltipProviderOne = function(date)
        {
            var today = new Date();
            var MS_PER_DAY = 1000 * 60 * 60 * 24;
            var utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
            var utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

            var diff = Math.floor((utcDate - utcToday) / MS_PER_DAY);

            if(diff === 0)
            {
                return "T";
            }

            if(diff > 0)
            {
                return "T+" + diff;
            }

            return "T-" + Math.abs(diff);
        };

        $scope.tooltipProviderTwo = function(date)
        {
            return "C";
        };

        $scope.today = function()
        {
            $scope.dt = new Date();
        };

        $scope.today();

        $scope.clear = function()
        {
            $scope.dt = null;
        };

        $scope.disabled = function(date, mode)
        {
            return false; //(mode === "day" && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.toggleMin = function()
        {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        $scope.toggleMin();

        $scope.open = function($event)
        {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: "yy",
            startingDay: 1
        };

        $scope.formats = ["dd-MMMM-yyyy", "yyyy/MM/dd", "dd.MM.yyyy", "shortDate"];
        $scope.format = $scope.formats[0];

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        var afterTomorrow = new Date();
        afterTomorrow.setDate(afterTomorrow.getDate() + 2);

        $scope.events = [
        {
            date: tomorrow,
            status: "full"
        },
        {
            date: afterTomorrow,
            status: "partially"
        }];

        $scope.getDayClass = function(date, mode)
        {
            if(mode === "day")
            {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for(var counter=0; counter < $scope.events.length; ++counter)
                {
                    var currentDay = new Date($scope.events[counter].date).setHours(0, 0, 0, 0);

                    if(dayToCheck === currentDay)
                    {
                        return $scope.events[counter].status;
                    }
                }
            }

            return "";
        };
    });
}(window.angular));
