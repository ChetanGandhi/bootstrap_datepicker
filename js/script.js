(function(angular)
{
    function injectors(scope)
    {
        return {
            showHideWeeks: function()
            {
                scope.showWeeks = !scope.showWeeks;
            },
            lableProvider: function(date)
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

                directive.templateUrl = function(element, attrs)
                {
                        return attrs.templateUrl || "templates/daypickerOverride.tpl.html";
                };

                directive.compile = function(scope, element, attrs, ctrl)
                {
                    return function(scope, element, attrs, ctrl)
                    {
                        originalLink(scope, element, attrs, ctrl);

                        var customInjectors = injectors(scope);

                        scope.showHideWeeks = customInjectors.showHideWeeks;
                        scope.lableProvider = customInjectors.lableProvider;

                        // Uncomment below code to use tooltip selector,
                        // add .custom-tooltip' as class and 'dt' as attribute to button
                        // in template and remove the 'date-button' directive from template.
                        //
                        //Code:
                        //-----------------------
                        // <button type="button" dt="{{dt}}" style="min-width:100%;" class="btn btn-default btn-sm custom-tooltip" ng-class="{'btn-info': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="::{'text-muted': dt.secondary, 'text-info': dt.current}">{{::dt.label}}</span></button>
                        //-----------------------
                        //
                        // $(element).tooltip({
                        //     selector: '.custom-tooltip',
                        //     title: function(){
                        //         console.log($(this));
                        //         var dt = JSON.parse(this.getAttribute("dt"));
                        //         console.log(dt);
                        //         return scope.lableProvider(new Date(dt.date));
                        //     },
                        //     placement: "bottom",
                        //     trigger: "hover"
                        // });
                    }
                }

                return $delegate;
            });
        }

        angular.module('ui.bootstrap.datepicker').directive('dayButton', function()
        {
            var link = function(scope, element, attrs, ctrl)
            {
                $("[data-toggle='tooltip']").tooltip({
                    title: function()
                    {
                        return scope.lableProvider(scope.dt.date);
                    },
                    placement: "bottom",
                    trigger: "hover"
                });
            };

            return {
                link: link,
                templateUrl: function(element, attrs)
                {
                    return attrs.templateUrl || "templates/dayButton.tpl.html";
                }
            };
        });

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
