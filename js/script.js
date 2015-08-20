(function(angular)
{
    function injectors(scope)
    {
        return {
            showHideWeeks: function()
            {
                scope.showWeeks = !scope.showWeeks;
            },
            lableProvider:function(date)
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
            }};
        };

        angular.module('sample.datepicker', ['ui.bootstrap']).config(['$provide', Decorate]);

        function Decorate($provide)
        {
            $provide.decorator('daypickerDirective', function($delegate)
            {
                var directive = $delegate[0];
                var originalLink = directive.link;

                directive.compile = function(scope, element, attrs, ctrl)
                {
                    return function(scope, element, attrs, ctrl)
                    {
                        originalLink(scope, element, attrs, ctrl);

                        var customInjectors = injectors(scope);

                        scope.showHideWeeks = customInjectors.showHideWeeks;
                        scope.lableProvider = customInjectors.lableProvider;
                    }
                }

                directive.templateUrl = "templates/daypickerOverride.tpl.html";

                return $delegate;
            });
        }

        angular.module('sample.datepicker').controller('datePickerSampleController', function($scope)
        {
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
                return (mode === "day" && (date.getDay() === 0 || date.getDay() === 6));
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
