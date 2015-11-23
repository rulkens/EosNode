/**
  * @ngdoc service
  * @name utils.factory:highchartsTheme
  * @requires $log
  * @requires $window
  * @description
  * set global theming options for HighCharts
  */
angular.module('utils')
    .factory('highchartsTheme', highchartsTheme);

/* @ngInject */
function highchartsTheme($log, $window) {

    // Todo : Error handling

    return {
        setTheme: setTheme
    };

    function setTheme(){
        /**
          * Grid theme for Highcharts JS
          * @author Torstein Hønsi
          */

        Highcharts.setOptions({
            lang: {
                months: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
                shortMonths: ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
            }
        });

        Highcharts.theme = {
            colors: ['#bf5c17', '#ebb11a', '#587129', '#fee5a1', '#ccc', '#fff5da', '#ababaa', '#cccccc', '#e6e6e6'],
            chart: {

                backgroundColor: 'transparent', //{
                //    linearGradient: [0, 0, 500, 500],
                //    stops: [
                //    //[0, 'rgb(255, 255, 255)'],
                //		[1, 'rgb(244, 247, 251)']
                //	]
                //},
                style: {
                    fontFamily: 'Din, arial, verdana',
                    color: '#000'

                },
                //borderWidth: 2,
                plotBackgroundColor: 'rgba(255, 255, 255, 1)',
                plotShadow: false,
                plotBorderWidth: 1
            },
            title: {
                style: {
                    color: '#4572A7',
                    fontWeight: '600',
                    fontSize: '18px'
                }
            },
            subtitle: {
                style: {
                    color: '#000',
                    fontWeight: '600',
                    fontSize: '16px'
                }
            },
            xAxis: [{
                type: 'datetime',
                labels: {
                    style: {
                        color: '#000',
                        fontWeight: 'normal',
                        fontSize: '14px'
                    }
                }
            }],
            yAxis: [{
                gridLineWidth: 1,
                minorTickInterval: 'auto',
                lineColor: '#000',
                lineWidth: 1,
                tickWidth: 1,
                tickColor: '#000',
                labels: {
                    style: {
                        color: '#000',
                        fontWeight: 'normal',
                        fontSize: '14px'
                    }
                },
                title: {
                    style: {
                        color: '#4572A7',
                        fontWeight: '600',
                        fontSize: '14px'
                    }
                }
            }],
            legend: {
                itemStyle: {
                    color: '#000',
                    fontWeight: 'normal',
                    fontSize: '13px'

                },
                itemHoverStyle: {
                    color: '#ccc'
                },
                itemHiddenStyle: {
                    color: '#5f5f5f'

                }
            },

            labels: {
                style: {
                    color: '#000'
                }
            }
        };

        // Apply the theme
        var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
    }
}
