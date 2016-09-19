'use strict';

(function ($) {
    var i18n = {
        allowed: [
            'en',
            'fr'
        ],
        fr: {
            days: 'Jours',
            months: 'Mois',
            list: 'Liste'

        },
        en: {
            days: 'Days',
            months: 'Months',
            list: 'List'
        }
    };
    
    $.fn.pitScheduler = function (options){

        var $scheduler = $(this);


        /********* Settings initialization *********/
        console.group();
        console.info('Settings initialization');

        var settings = $.extend({
            date: {
                current: moment(),
                selected: moment()
            },
            uiElements: {

            },
            currentDisplay: ''
        }, options);

        /* Check if the default display is defined */
        if (settings.defaultDisplay === undefined) {
            settings.currentDisplay = 'days';
        } else {
            settings.defaultDisplay.toLowerCase();
            if (settings.defaultDisplay !== 'days' && settings.defaultDisplay !== 'months' && settings.defaultDisplay !== 'list') {
                settings.currentDisplay = 'days';
            } else
                settings.currentDisplay = settings.defaultDisplay;
        }

        /* Check if the default locale is defined */
        if (settings.locale === undefined || i18n.allowed.indexOf(settings.locale) == -1) {
            settings.locale = 'en';
        }
        moment.locale(settings.locale);
        settings.i18n = i18n[settings.locale];

        console.log("Locale: " + settings.locale);
        console.log("Current display: " + settings.currentDisplay);
        console.log("Moment.locale(): " + moment.locale());
        console.log("Selected date: " + settings.date.selected);



        console.groupEnd();

        /********* Main functions *********/

        console.group();
        console.info('Main functions');

        /* update display view*/
        var updateDisplay = function (format) {
            switch (format) {
                case 'days':
                    $('.pts-header-right-container  .pts-btn-day-view').addClass('pts-active');
                    $('.pts-header-right-container  .pts-btn-month-view').removeClass('pts-active');
                    $('.pts-header-right-container  .pts-btn-list-view').removeClass('pts-active');
                    $('.pts-header-date-display').empty();
                    $('.pts-header-date-display').append(moment(settings.date.selected).locale('fr').format('LL'));
                    settings.currentDisplay = 'days'
                    updateDatePicker();
                    break;
                case 'months':
                    $('.pts-header-right-container  .pts-btn-day-view').removeClass('pts-active');
                    $('.pts-header-right-container  .pts-btn-month-view').addClass('pts-active');
                    $('.pts-header-right-container  .pts-btn-list-view').removeClass('pts-active');
                    $('.pts-header-date-display').empty();
                    $('.pts-header-date-display').append(moment(settings.date.selected).locale('fr').format('MMMM YYYY'));
                    settings.currentDisplay = 'months';
                    updateDatePicker();
                    break;
                case 'list':
                    $('.pts-header-right-container  .pts-btn-day-view').removeClass('pts-active');
                    $('.pts-header-right-container  .pts-btn-month-view').removeClass('pts-active');
                    $('.pts-header-right-container  .pts-btn-list-view').addClass('pts-active');
                    $('.pts-header-date-display').empty();
                    $('.pts-header-date-display').append(moment(settings.date.selected).locale('fr').format('LL'));
                    settings.currentDisplay = 'list';
                    updateDatePicker();
                    break;

            }
        };

        var updateDatePicker = function () {
            $('#header-datetimepicker').datetimepicker();
            $('#header-datetimepicker').data('DateTimePicker').locale(settings.locale);
            $('#header-datetimepicker').data('DateTimePicker').defaultDate(settings.date.selected);
            $('#header-datetimepicker').data('DateTimePicker').date(settings.date.selected);
            $('#header-datetimepicker').data('DateTimePicker').viewDate(settings.date.selected);
            $('#header-datetimepicker').data('DateTimePicker').enabledHours(false);
            $('#header-datetimepicker').data('DateTimePicker').format((settings.currentDisplay === 'months' ? 'MM/YYYY' : 'L'));
            $('#header-datetimepicker').data('DateTimePicker').viewMode((settings.currentDisplay === 'months' ? 'months' : 'days'));

        };

        var goForward = function () {
            if (settings.currentDisplay == 'months') {
                settings.date.selected = moment(settings.date.selected).add(1, 'months');
            } else {
                settings.date.selected = moment(settings.date.selected).add(1, 'day');
            }
            updateDisplay(settings.currentDisplay);
        };

        var goBackward = function () {
            if (settings.currentDisplay == 'months') {
                settings.date.selected = moment(settings.date.selected).add(-1, 'months');
            } else {
                settings.date.selected = moment(settings.date.selected).add(-1, 'day');
            }
            updateDisplay(settings.currentDisplay);
        };

        console.groupEnd();

        /********* Generation *********/
        console.group();
        console.info('Generation');

        /* Generate the header content */
        var generateHeader = function () {
            var $header =   '<div class="pts-header row">' +
                            '<div class="pts-header-left-container pull-left">' +
                            '<div class="form-group">' +
                            '<div class="input-group date" id="header-datetimepicker">' +
                            '<input type="text" class="form-control"/>' +
                            '<span class="input-group-addon">' +
                            '<span class="glyphicon glyphicon-calendar"></span>' +
                            '</span></div></div>' +
                            '<span class="pts-header-date-display">' +
                            (settings.currentDisplay === "months" ? moment(settings.date.selected).locale('fr').format('MMMM YYYY') : moment(settings.date.selected).locale('fr').format('LL')) +
                            '</span></div>' +
                            '<div class="pts-header-right-container pull-right">' +
                            '<button class="btn btn-sm pts-btn-previous"><i class="glyphicon glyphicon-chevron-left"></i></button>' +
                            '<button class="btn btn-sm pts-btn-next"><i class="glyphicon glyphicon-chevron-right"></i></button>' +
                            '<button class="btn btn-sm pts-btn-day-view ' + (settings.currentDisplay === "days" ? "pts-active" : "") + '">' + settings.i18n.days + '</button>' +
                            '<button class="btn btn-sm pts-btn-month-view ' + (settings.currentDisplay === "months" ? "pts-active" : "") + '">' + settings.i18n.months + '</button>' +
                            '<button class="btn btn-sm pts-btn-list-view" ' + (settings.currentDisplay === "list" ? "pts-active" : "") + '>' + settings.i18n.list + '</button></div></div>';

            $scheduler.append($header);
            updateDatePicker();
        };

        /* Generate base empty base structure */
        var generateBaseView = function () {
            var $mainContainer =    '<div class="pts-main-container row">' +
                                    '<div class="pts-corder-mask"></div>' +
                                    '<div class="pts-column-title-container">' +
                                    '<div></div></div>' +
                                    '<div class="pts-line-title-container"><div>' +
                                    '</div></div>' +
                                    '<div class="pts-scheduler-container">' +
                                    '<div class="pts-main-content">' +
                                    '</div></div></div>';

            $scheduler.append($mainContainer);
        };

        /* Generate the table columns lines */
        var generateTableLines = function () {

            $('.pts-column-title-container > div').empty();
            $('.pts-main-content').empty();
            if (settings.currentDisplay == 'days') {
                var lineInterval = 0;
                for (var i=0; i < 25; i++) {
                    $('.pts-column-title-container > div').append('<div class="pts-column-element">' + (i < 24 ? "<p>"+i+":00</p>" : "") + '</div>');
                    if (i < 24) {
                        $('.pts-main-content').append('<div class="pts-main-category-column" style="left:' + lineInterval + 'px"><div></div></div>');
                    }
                    lineInterval += 120;
                }
            } else if (settings.currentDisplay == 'months') {
                var lineInterval = 0,
                    daysInMonth = parseInt(moment(settings.date.selected).daysInMonth()) + 1;
                for (var i=1; i <= daysInMonth; i++) {
                    $('.pts-column-title-container > div').append('<div class="pts-column-element">' + (i < daysInMonth  ? "<p>"+i+"</p>" : "") + '</div>');
                    if (i < daysInMonth) {
                        $('.pts-main-content').append('<div class="pts-main-category-column" style="left:' + lineInterval + 'px"><div></div></div>');
                    }
                    lineInterval += 120;
                }
            }
        };

        console.groupEnd();


        /********* Initialization *********/
        console.group();
        console.log("Initialization");

        generateHeader();
        generateBaseView();
        generateTableLines();

        console.groupEnd();

        /********* Events *********/
        console.group();
        console.info('Events');

        $('.pts-btn-day-view').click( function () {
            updateDisplay('days');
            generateTableLines();
        });
        $('.pts-btn-month-view').click( function () {
            updateDisplay('months');
            generateTableLines();
        });
        $('.pts-btn-list-view').click( function () {
            updateDisplay('list');
        });
        $('.pts-scheduler-container').scroll(function () {
            $('.pts-line-title-container div').scrollTop($(this).scrollTop());
            $('.pts-column-title-container ').scrollLeft($(this).scrollLeft());
        });
        $('.pts-btn-next').click(function () {
            goForward();
            generateTableLines();
        });
        $('.pts-btn-previous').click(function () {
            goBackward();
            generateTableLines();
        });
        $('#header-datetimepicker').on('dp.change', function (e) {
            if (e.date === settings.date.selected) return console.log("EGALE");
            settings.date.selected = e.date;
            updateDisplay(settings.currentDisplay);
        });

        console.groupEnd();


        return $scheduler;
    };
}(jQuery));
