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

                scope.customHandler = function()
                {
                    //scope.showWeeks = !scope.showWeeks;
                    scope.toggleMode();
                };
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
