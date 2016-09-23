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
            list: 'Liste',
            unlisted: 'Non répertorié',
            settings: 'Options',
            hideEmptyLine: 'Masquer les lignes sans tâche'

        },
        en: {
            days: 'Days',
            months: 'Months',
            list: 'List',
            unlisted: 'Unlisted',
            settings: 'Settings',
            hideEmptyLine: 'Hide lines with no task'
        }
    };
    
    $.fn.pitScheduler = function (options) {

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
                settings.currentDisplay = 'months';
            } else
                settings.currentDisplay = settings.defaultDisplay;
        }

        /* Check if the default locale is defined */
        if (settings.locale === undefined || i18n.allowed.indexOf(settings.locale) == -1) {
            settings.locale = 'en';
        }
        moment.locale(settings.locale);
        settings.i18n = i18n[settings.locale];
        
        if (settings.hideEmptyLines === undefined) {
            settings.hideEmptyLines = true;
        }

        console.log("Locale: " + settings.locale);
        console.log("Current display: " + settings.currentDisplay);
        console.log("Moment.locale(): " + moment.locale());
        console.log("Selected date: " + settings.date.selected);



        console.groupEnd();

        /********* Main functions *********/

        /* update display view */
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

        /* Update the content of the datepicker */
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

        /* Go to the next month/day */
        var goForward = function () {
            if (settings.currentDisplay == 'months') {
                settings.date.selected = moment(settings.date.selected).add(1, 'months');
            } else {
                settings.date.selected = moment(settings.date.selected).add(1, 'day');
            }
            updateDisplay(settings.currentDisplay);
        };

        /* Go to the previous month/day */
        var goBackward = function () {
            if (settings.currentDisplay == 'months') {
                settings.date.selected = moment(settings.date.selected).add(-1, 'months');
            } else {
                settings.date.selected = moment(settings.date.selected).add(-1, 'day');
            }
            updateDisplay(settings.currentDisplay);
        };

        /* Return a task from his Id */
        var getTaskById = function (taskId) {
            var task;
            settings.tasks.forEach(function (e) {
                if (e.id === taskId) {
                    task = e;
                }
            });
            return task;
        };

        /* Get the height of a user line */
        var getUserLineHeight = function (user) {
            var tasks = [];
            user.tasks.forEach(function (task) {
                if (tasks.indexOf(task.id) < 0 && userLineIsHidden(user) == true) {
                    tasks.push(task.id);
                }
            });
            return tasks.length * 40;
        };

        /* Return true if user task must be showed */
        var userLineIsHidden = function (user) {
            var response = 0,
                tasks = [];
            user.tasks.forEach(function (task) {
                if (moment(settings.date.selected).get('year') >= moment(task.start_date).get('year')
                    && moment(settings.date.selected).get('year') <= moment(task.end_date).get('year')) {
                    if (settings.currentDisplay === 'months' && moment(settings.date.selected).get('month') >= moment(task.start_date).get('month')
                        && moment(settings.date.selected).get('month') <= moment(task.end_date).get('month')) {
                        response++;
                    } else if (settings.currentDisplay === 'days' && moment(settings.date.selected).get('day') >= moment(task.start_date).get('day')
                        && moment(settings.date.selected).get('day') <= moment(task.end_date).get('day')) {
                        response++;
                    }
                }
            });
            return ((settings.hideEmptyLines === true && response > 0) || settings.hideEmptyLines === false ? true: false);
        };

        /* Move task label on horizontal scroll */
        var setTaskLabelPosition = function () {
            if (settings.disableLabelsMovement) return;
            var $elements = $('.pts-line-marker:has(+ span.pts-line-marker-label)'),
                limit = parseInt($('.pts-line-title-container').offset().left + $('.pts-line-title-container').width());
            $.each($elements, function() {
                var $label = $(this).next(),
                    right = parseInt($(this).offset().left) + parseInt($(this).width()) - parseInt($label.width()),
                    left = parseInt($(this).offset().left);
                if (left < limit && right > limit + 20) {
                    $label.css('left', $('.pts-scheduler-container').scrollLeft() + 10)
                } else {
                    $label.css('left', $label.attr('data-left') + 'px');
                }

            });
        };

        /********* Generation *********/

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
                            '<div class="pts-nav-buttons">' +
                            '<button class="btn pts-btn-previous"><i class="glyphicon glyphicon-chevron-left"></i></button>' +
                            '<button class="btn pts-btn-next"><i class="glyphicon glyphicon-chevron-right"></i></button>' +
                            '</div>' +
                            '<span class="pts-header-date-display">' +
                            (settings.currentDisplay === "months" ? moment(settings.date.selected).locale('fr').format('MMMM YYYY') : moment(settings.date.selected).locale('fr').format('LL')) +
                            '</span></div>' +
                            '<div class="pts-header-right-container pull-right">' +
                            '<button class="btn btn-sm pts-btn-day-view ' + (settings.currentDisplay === "days" ? "pts-active" : "") + '">' + settings.i18n.days + '</button>' +
                            '<button class="btn btn-sm pts-btn-month-view ' + (settings.currentDisplay === "months" ? "pts-active" : "") + '">' + settings.i18n.months + '</button>' +
                            '<button class="btn btn-sm pts-btn-list-view" ' + (settings.currentDisplay === "list" ? "pts-active" : "") + '>' + settings.i18n.list + '</button></div></div>';

            $scheduler.append($header);
            updateDatePicker();
        };

        /* Generate base empty base structure */
        var generateBaseView = function () {
            var $mainContainer =    '<div class="pts-main-container row">' +
                                    '<div class="pts-corder-mask"><div class="dropdown">' +
                                    '<button class="btn btn-default dropdown-toggle" type="button" id="settingsDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                    settings.i18n.settings + ' <span class="caret"></span></button>' +
                                    '<ul class="dropdown-menu" aria-labelledby="settingsDropdown">' +
                                    '<li><label class="checkbox-inline"><input id="hide-user-btn" type="checkbox" value="" checked="' + settings.hideEmptyLines + '">'+ settings.i18n.hideEmptyLine +'</label></li>' +
                                    '</div></div>' +
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
                        $('.pts-main-content').append('<div class="pts-main-group-column" style="left:' + lineInterval + 'px"><div></div></div>');
                    }
                    lineInterval += 120;
                }
            } else if (settings.currentDisplay == 'months') {
                var dayDate = moment(settings.date.selected).add(-1 * (moment(settings.date.selected).format('D') - 1), 'day');
                var lineInterval = 0,
                    daysInMonth = parseInt(moment(settings.date.selected).daysInMonth()) + 1;
                for (var i=1; i <= daysInMonth; i++) {
                    $('.pts-column-title-container > div').append(
                        '<div class="pts-column-element" data-date="' + moment(dayDate).format('YYYY-MM-DD') + '">' +
                        (i < daysInMonth  ? "<p>"+ dayDate.locale(settings.locale).format('ddd') + ' ' + i +"</p>" : "") + '</div>'
                    );
                    if (i < daysInMonth) {
                        $('.pts-main-content').append('<div class="pts-main-group-column" style="left:' + lineInterval + 'px"><div></div></div>');
                    }
                    lineInterval += 120;
                    dayDate.add(1, 'day');
                }
            }
        };

        /* Generate the groups panels */
        var generateGroupsPanels = function () {
            var keepUnlisted = true;

            settings.groups = [settings.i18n.unlisted];
                settings.users.forEach(function (e) {
                    if (e.group === undefined || e.group === '') {
                        e.group = settings.i18n.unlisted;
                        keepUnlisted = false;
                    }
                    else if (settings.groups.indexOf(e.group) == -1) {
                        settings.groups.push(e.group);
                    }
                });
            console.log(settings.users);
            settings.groups.unlisted = 0; //stores the id of the unlisted group
            if (keepUnlisted) {
                settings.groups.shift();
            }
            settings.groups.added = [];
            settings.groups.forEach(function (e, i) {
                if (i !== 'added' && i !== 'unlisted') {
                    generateGroupTab(e, i);
                    settings.groups.added.push({
                        name: e,
                        id: 'user-group-' + i
                    });
                }
            });
        };

        /* Add one group to the scheduler */
        var generateGroupTab = function (group, index) {
            console.log("group: " + group + " index: " + index);
            console.log("Creat group: " + group);
            var $groupHeaderContent =   '<div id="user-group-' + index + '" class="pts-line-group-container">' +
                                        '<div class="pts-group-header">' +
                                        '<i class="glyphicon glyphicon-remove pull-left close-group-panel" data-group="' + index + '" data-toggle="opened"></i>' +
                                        '<span>' + group + '</span></div>' +
                                        '<div class="pts-group-content"></div></div>';
            var $groupMainContent =     '<div class="pts-main-group-container">' +
                                        '<div class="pts-main-group-header"></div></div>';
            $('.pts-line-title-container > div').append($groupHeaderContent);
        };

        /* Generate the main group content and header */
        var generateGroupMainContent = function () {
            settings.groups.added.forEach(function (group, groupIndex) {
                var $groupMainContent = '<div id="group-container-' + groupIndex + '" class="pts-main-group-container">' +
                                        '<div class="pts-main-group-header"></div></div>';
                $('.pts-main-content').append($groupMainContent);
                settings.users.forEach(function (user, userIndex) {
                    if (user.group === group.name && userLineIsHidden(user) == true) {
                        $('#group-container-' + groupIndex).append('<div id="content-user-' + userIndex + '" class="pts-main-group-user" style="height:' + getUserLineHeight(user) + 'px"></div>');
                    }
                });
                //Check if the group panel must be closed
                if ($('.close-group-panel[data-group='+groupIndex+']').attr('data-toggle') === 'closed') {
                    $('#group-container-' + groupIndex).children('.pts-main-group-user').css('display', 'none');
                }
            });
            //Generate group header line
            if (settings.currentDisplay == 'days') {
                $('.pts-main-group-header').css('width', '2880px');
                $('.pts-main-group-user').css('width', '2880px');
            } else {
                $('.pts-main-group-header').css('width', (120 * moment(settings.date.selected).daysInMonth()) + 'px');
                $('.pts-main-group-user').css('width', (120 * moment(settings.date.selected).daysInMonth()) + 'px');
            }
            settings.users.forEach(function (user, userIndex) {
                generateTaskLines(user, userIndex);
            });
        };

        /* Generate the left users list */
        var generateUsersList = function () {
            if (!settings.users || settings.users.length <= 0) return console.warn('Warning: No user have been set.');

            $('.pts-group-content').empty();
            settings.users.forEach(function (user) {
                var group = '';
                settings.groups.added.forEach(function (_group) {
                    if (_group.name == user.group || (user.id && _group.users && _group.users.indexOf(user.id) >= 0)) {
                        group = _group.id;
                    }
                });
                if (!group) {
                    console.log('User ' + user.name + ' has not group.');

                    if (!settings.groups.unlisted) {
                        console.log('Unlisted group do not exist, creating one');
                        generateGroupTab({name: settings.i18n.unlisted}, settings.groups.added.length);
                        settings.groups.unlisted = settings.groups.added.length;
                        settings.groups.added.push({
                            name: settings.i18n.unlisted,
                            id: 'user-group-' + settings.groups.added.length
                        });
                    }

                    group = settings.groups.added[settings.groups.unlisted].id;
                }
                generateUserLine(user, group)
            });
        };
        
        /* Add one user line */
        var generateUserLine = function (user, group) {
            if (!user.tasks) return console.warn('Warning: user ' + user.name + 'has no task assigned to himself');
            if (userLineIsHidden(user) == false) return;
            console.log('Generate line for user: ' + user.name + ' in group: ' + group);

            var $userNameUI = '<div class="pts-group-user" style="height:' + getUserLineHeight(user) + 'px"><p>' + user.name + '</p></div>';

            $('#' + group + ' > .pts-group-content').append($userNameUI);

        };

        /* Generate the tasks lines */
        var generateTaskLines = function (user, userIndex) {
            user.userIndex = userIndex;
            var topDistance = 5;
            user.tasks.forEach(function (e, i) {
                var task = $.extend(getTaskById(e.id), e);
                task.index = i;
                if (task === undefined) return console.warn('Warning: Task ' + e.id + ' has not be found in tasks array for user ' + user.name);
                if (task.start_date >= task.end_date) return console.warn('Warning: end_date must be later than start_date for user ' + user.name + 'in task ' + e.id);
               if (settings.currentDisplay === 'months') {
                   if (task.end_date) {
                       if (moment(settings.date.selected).get('year') >= moment(task.start_date).get('year')
                           && moment(settings.date.selected).get('year') <= moment(task.end_date).get('year')) {
                           if (moment(settings.date.selected).get('month') >= moment(task.start_date).get('month')
                               && moment(settings.date.selected).get('month') <= moment(task.end_date).get('month')) {
                               topDistance += generateTaskLineMonth(user, task, topDistance);
                           }
                       }
                   }
               }
            });
        };

        /* Generate one task on the month view */
        var generateTaskLineMonth = function (user, task, topDistance) {
            var userIndex = user.userIndex;
            var existingTaskLine = $('div[data-task=' + task.id + '][data-user=' + userIndex + '] > .pts-line-marker');

            if (existingTaskLine.length > 0) {
                topDistance = existingTaskLine.css('top');
            }

            $('#content-user-' + userIndex).append('<div class="pts-line-marker-group-' + task.index + '" data-task="' + task.id + '" data-user="' + userIndex + '"></div>');

            // If the task start date is in the current month
            if (moment(settings.date.selected).get('month') == moment(task.start_date).get('month')) {
                var splitted = (moment(task.start_date).format('H') >= 12 ? 60 : 0),
                    leftDistance = (120 * (moment(task.start_date).format('D') - 1)) + splitted - 6,
                    label_end = false;

                if (moment(task.end_date).get('month') > moment(settings.date.selected).get('month')) {
                    var labelWidth = 120 * (parseInt(moment(settings.date.selected).daysInMonth()) - parseInt(moment(task.start_date).format('D'))) + (splitted == 0 ? 120 : 60);
                } else {
                    var labelWidth = 120 * (moment(task.end_date).format('D') - moment(task.start_date).format('D') ) + (splitted == 0 ? 120 : 60);
                    label_end = true;
                }
                topDistance = parseInt(topDistance);
                leftDistance = parseInt(leftDistance);
                var $task = '<div class="progress-bar-striped pts-line-marker '+ (label_end ? 'complete' : 'start') +'" style="top:'+topDistance+'px;left:'+ leftDistance +'px;background-color:' + task.color + ';width:'+labelWidth+'px" data-task="' + task.id + '"></div>' +
                             '<span class="pts-line-marker-label" style="left:' + (leftDistance + 20) + 'px;top:' + (topDistance + 5) + 'px" data-left="' + (leftDistance + 20) + '">' + task.name + '</span>';
                $('#content-user-' + userIndex + ' > .pts-line-marker-group-' + task.index).append($task);
            }

            // If the task end date is in the current month
            if (moment(settings.date.selected).get('month') == moment(task.end_date).get('month')) {
                if (moment(task.start_date).get('month') < moment(settings.date.selected).get('month')) {

                    var splitted = (moment(task.end_date).format('H') <= 12 ? 60 : 0);
                    var labelWidth = 120 * (moment(task.end_date).format('D')) - splitted;

                    topDistance = parseInt(topDistance);
                    var $task = '<div class="progress-bar-striped pts-line-marker end" style="top:' + topDistance + 'px;left:0px;background-color:' + task.color + ';width:'+labelWidth+'px" data-task="' + task.id + '"></div>' +
                                 '<span class="pts-line-marker-label" style="left:10px;top:' + (topDistance + 5) + 'px" data-left="10">' + task.name + '</span>';
                    $('#content-user-' + userIndex + ' > .pts-line-marker-group-' + task.index).append($task);
                }
            }

            // If the task start and end dates are not in the current month but the task is
            if (moment(settings.date.selected).get('month') != moment(task.end_date).get('month') && moment(settings.date.selected).get('month') != moment(task.start_date).get('month')) {
                topDistance = parseInt(topDistance);
                var $task = '<div class="progress-bar-striped pts-line-marker middle" style="top:' + topDistance + 'px;left:0px;background-color:' + task.color + ';" data-task="' + task.id + '"></div>' +
                             '<span class="pts-line-marker-label" style="left:10px;top:' + (topDistance + 5) + 'px" data-left="10">' + task.name + '</span>';
                $('#content-user-' + userIndex + ' > .pts-line-marker-group-' + task.index).append($task);
            }
            //TODO: Add task label
            setTaskLabelPosition();
            return (existingTaskLine.length > 0 ? 0 : 40);
        };

        /********* Initialization *********/
        console.group();
        console.info("Initialization");

        generateHeader();
        generateBaseView();
        generateTableLines();
        generateGroupsPanels();
        generateGroupMainContent();
        generateUsersList();

        console.groupEnd();

        /********* Events *********/

        $('.pts-btn-day-view').click( function () {
            updateDisplay('days');
            generateTableLines();
            generateGroupMainContent();
        });

        $('.pts-btn-month-view').click( function () {
            updateDisplay('months');
            generateTableLines();
            generateGroupMainContent();
        });

        $('.pts-scheduler-container').scroll(function () {
            $('.pts-line-title-container div').scrollTop($(this).scrollTop());
            $('.pts-column-title-container ').scrollLeft($(this).scrollLeft());
        });

        $('.pts-btn-next').click(function () {
            goForward();
            generateTableLines();
            generateGroupMainContent();
            generateUsersList();
        });

        $('.pts-btn-previous').click(function () {
            goBackward();
            generateTableLines();
            generateGroupMainContent();
            generateUsersList();
        });

        $('#header-datetimepicker').on('dp.change', function (e) {
            if (e.date === settings.date.selected) return console.log("EGALE");
            settings.date.selected = e.date;
            updateDisplay(settings.currentDisplay);
        });

        $('.close-group-panel').click(function () {
            var $usersPanel = $('#group-container-' + $(this).attr('data-group'));
            var $groupPanel = $('#user-group-' + $(this).attr('data-group'));
            if ($(this).attr('data-toggle') === 'opened') {
                $usersPanel.children('.pts-main-group-user').css('display', 'none');
                $groupPanel.children('.pts-group-content').css('display', 'none');
                $(this).attr('data-toggle', 'closed');
                $(this).addClass('closed-btn');
            } else {
                $usersPanel.children('.pts-main-group-user').css('display', 'block');
                $groupPanel.children('.pts-group-content').css('display', 'block');
                $(this).attr('data-toggle', 'opened');
                $(this).removeClass('closed-btn');
            }
        });

        $('#hide-user-btn').change(function (e) {
            settings.hideEmptyLines = $(this).is(':checked');
            generateTableLines();
            generateGroupMainContent();
            generateUsersList();
        });

        $('.pts-column-title-container').on('click', '.pts-column-element[data-date]', function () {
            settings.date.selected = moment($(this).attr('data-date'));
            updateDisplay('days');
            generateTableLines();
            generateGroupMainContent();
            console.log("OKKKKK");
        });

        $('.pts-scheduler-container').scroll(function () {
            setTaskLabelPosition();
        });

        return $scheduler;
    };
}(jQuery));
