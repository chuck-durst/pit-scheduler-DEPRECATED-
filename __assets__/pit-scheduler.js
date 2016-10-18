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
            hideEmptyLine: 'Masquer les lignes sans tâche',
            description: 'Description',
            assignedUsers: 'Utilisateurs assignés',
            from: 'Du',
            to: 'au',
            notSpecified: 'Non spécifiée',
            disableLabelsMovement: 'Désactiver le mouvement des labels',
            today: 'Aujourd\'hui',
            thisWeek: 'Cette semaine',
            thisMonth: 'Ce mois-ci',
            thisYear: 'Cette année',
            personalized: 'Personnalisé',
            selectAll: 'Tout sélectionner',
            always: 'toujours',
            total: 'Total',
            usersWhose: 'utilisateur(s) dont',
            cycleWhose: 'cycle(s) dont',
            inSelectedPeriod: 'dans la période sélectionnée',
            all: 'Tout',
            search: 'Recherche',
            addNewTask: 'Créer une tâche',
            addNewUser: 'Créer un utilisateur',
            name: 'Nom',
            required: 'Obligatoire',
            color: 'Couleur',
            cancel: 'Annuler',
            create: 'Créer',
            createAndAssign: 'Créer et assigner',
            nameAlreadyTaken: 'Ce nom est déjà utilisé',
            idAlreadyTaken: 'Cet ID est déjà utilisé',
            remove: 'Supprimer',
            assign: 'Assigner',
            edit: 'Modifier',
            confirm: 'Confirmer',
            assignTaskTitle: 'Assigner des utilisateurs',
            allInputRequired: 'Tous les champs sont obligatoires',
            requiredField: 'Ce champ est obligatoire',
            userIsAlreadyAssigned: 'est déjà assigné à cette tâche pour cette période',
            selectUsersToAssign: 'Sélectionnez les utilisateurs à assigner',
            editTask: 'Modifier la tâche',
            group: 'Groupe',
            selectGroup: 'Sélectionnez un groupe existant',
            createNewGroup: 'Créez un nouveau groupe',
            or: 'ou',
            notif: {
                taskCreated: 'La tâche a été créée avec succès',
                userCreated: 'L\'utilisateur a été créé avec succès',
                taskRemoved: 'La tâche a correctement été supprimée',
                usersAssigned: 'utilisateurs ont été assignés à la tâche',
                userAssigned: 'utilisateur a été assigné à la tâche',
                userUnassigned: 'a correctement été désassigné',
                noUser: '<b>Attention : </b>Aucun utilisateur n\'a été défini',
                noTask: '<b>Attention : </b>Aucune tâche n\'a été définie',
                taskNotExist: 'est assigné à une tâche qui n\'existe pas',
                taskInformationsUpdated: 'La tâche a été modifiée',
                userHasNoTask: 'n\'est assigned à aucune tâche'
            }

        },
        en: {
            days: 'Days',
            months: 'Months',
            list: 'List',
            unlisted: 'Unlisted',
            settings: 'Settings',
            hideEmptyLine: 'Hide lines with no task',
            description: 'Description',
            assignedUsers: 'Assigned users',
            from: 'From',
            to: 'to',
            notSpecified: 'Not specified',
            disableLabelsMovement: 'Disable labels mouvement',
            today: 'Today',
            thisWeek: 'This week',
            thisMonth: 'This month',
            thisYear: 'This year',
            personalized: 'Personalized',
            selectAll: 'Select all',
            always: 'always',
            total: 'Total',
            usersWhose: 'user(s) with',
            cycleWhose: 'cycle(s) with',
            inSelectedPeriod: 'in the selected period',
            all: 'All',
            search: 'Search',
            addNewTask: 'Create a new task',
            addNewUser: 'Create a new user',
            name: 'Name',
            required: 'Required',
            color: 'Color',
            cancel: 'Cancel',
            create: 'Create',
            createAndAssign: 'Create and assign',
            idAlreadyTaken: 'This ID is already taken',
            remove: 'Remove',
            assign: 'Assign',
            edit: 'Edit',
            confirm: 'Confirm',
            assignTaskTitle: 'Assign users',
            allInputRequired: 'All fields are required',
            requiredField: 'That field is required',
            userIsAlreadyAssigned: 'is already assigned to this task for this period',
            selectUsersToAssign: 'Select the users to assign',
            editTask: 'Edit a task',
            group: 'Group',
            selectGroup: 'Select an existing group',
            createNewGroup: 'Create a new group',
            or: 'or',
            notif: {
                taskCreated: 'The task has been successfully created',
                userCreated: 'The user has been successfully created',
                taskRemoved: 'The task has been successfully removed',
                usersAssigned: 'users has been assigned to the task',
                userAssigned: 'user has been assigned to the task',
                userUnassigned: 'has correctly been unassigned',
                noUser: '<b>Warning : </b>No user has been set',
                noTask: '<b>Warning : </b>No task has been set',
                taskNotExist: 'is assigned to an inexistent task',
                taskInformationsUpdated: 'The task has been edited',
                userHasNoTask: 'is not assigned to any task'
            }
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
            currentDisplay: ''
        }, options);

        if (settings.defaultDisplay === undefined) {
            settings.currentDisplay = 'days';
        } else {
            settings.defaultDisplay.toLowerCase();
            if (settings.defaultDisplay !== 'days' && settings.defaultDisplay !== 'months' && settings.defaultDisplay !== 'list') {
                settings.currentDisplay = 'months';
            } else
                settings.currentDisplay = settings.defaultDisplay;
        }

        settings.defaultColor = (settings.defaultColor? settings.defaultColor : '#00BCD4');
        settings.notificationDuration = (settings.notificationDuration ? settings.notificationDuration : 4000);

        if (settings.locale === undefined || i18n.allowed.indexOf(settings.locale) == -1) {
            settings.locale = 'en';
        }
        moment.locale(settings.locale);
        settings.i18n = i18n[settings.locale];

        if (settings.hideEmptyLines === undefined || (settings.hideEmptyLines != true && settings.hideEmptyLines != false)) {
            settings.hideEmptyLines = true;
        }

        if (settings.defaultDate !== undefined && moment(settings.defaultDate).isValid()) {
            settings.date.selected = moment(settings.defaultDate);
        }

        console.groupEnd();

        /********* Main functions *********/

        /* update display view */
        var updateDisplay = function (viewMode) {
            console.warn('CALL FUNCTION: updateDisplay: viewMode:' + viewMode);
            updateDisplayReset();
            switch (viewMode) {
                case 'days':
                    setButtonViewFocus('day');
                    $('.pts-header-date-display').empty();
                    $('.pts-header-date-display').append(moment(settings.date.selected).locale(settings.locale).format('LL'));
                    settings.currentDisplay = 'days';
                    generateMainContent();
                    break;
                case 'months':
                    setButtonViewFocus('month');
                    $('.pts-header-date-display').empty();
                    $('.pts-header-date-display').append(moment(settings.date.selected).locale(settings.locale).format('MMMM YYYY'));
                    settings.currentDisplay = 'months';
                    generateMainContent();
                    break;
                case 'list':
                    setButtonViewFocus('list');
                    $('.pts-header-date-display').empty();
                    $('.pts-header-date-display').append(moment(settings.date.selected).locale(settings.locale).format('LL'));
                    settings.currentDisplay = 'list';
                        $('.pts-btn-next').attr('disabled', 'disabled');
                    $('.pts-btn-previous').attr('disabled', 'disabled');
                    $('.pts-header-date-display').css('display', 'none');
                    $('.pts-column-title-container').css('overflow', 'visible');
                    $('#header-datetimepicker').data("DateTimePicker").disable();
                    generateListBaseView();
                    switchListRange('today');
                    break;
            }
        };

        /* Reset elements content that have been modified */
        var updateDisplayReset = function () {
            console.warn('CALL FUNCTION: updateDisplayReset');
            closeInfoBox();
            $('.pts-main-content').empty();
            $('.pts-column-title-container > div').empty();
            $('.pts-line-title-container').empty();
            $('.pts-line-title-container').append($('<div></div>'));
            $('.pts-corner-mask').empty();
            $('.pts-btn-next').removeAttr('disabled');
            $('.pts-btn-previous').removeAttr('disabled');
            $('.pts-header-date-display').css('display', 'block');
            $('#header-datetimepicker').data("DateTimePicker").enable();
            $('.pts-column-title-container').css('overflow', 'hidden');
        };

        /* set the focus on the right view mode button */
        var setButtonViewFocus = function (viewMode) {
            $('.pts-header-right-container  button').removeClass('pts-active');
            $('.pts-header-right-container  .pts-btn-' + viewMode + '-view').addClass('pts-active');
        };

        /* Init function that saves users index into associated tasks */
        var getUsersTasksInTasks = function () {
            console.warn('CALL FUNCTION: getUsersTasksInTasks');
            if (!settings.tasks) return generateNotification('danger', settings.i18n.notif.noTask);
            settings.tasks.forEach(function (task) {
                task = generateTaskInTask(task);
            });
        };

        /* Add an index list of the assigned users to this task */
        var generateTaskInTask = function (task) {
            console.log('CALL FUNCTION: generateTaskInTask: task: ' + task.name);

            task.users = {};
            if (! settings.users) return generateNotification('danger', settings.i18n.notif.noUser );
            if (!task.color) task.color = (settings.defaultColor ? settings.defaultColor : '#00bdd6');
            settings.users.forEach(function (user, userIndex) {
                user.index = userIndex;
                if (user.tasks) {
                    user.tasks.forEach(function (userTask, taskIndex) {
                        if (userTask.id === task.id) {
                            if (!task.users[userIndex]) {
                                task.users[userIndex] = [];
                            }
                            task.users[userIndex].push(taskIndex);
                        }
                    });
                }
            });
            return task;
        };

        /* Generate the groups panels */
        var initGroup = function () {
            console.warn('CALL FUNCTION: initGroup');

            if ($('.pts-line-group-container').length || !settings.users) return;

            settings.defaultGroupName = (settings.defaultGroupName ? settings.defaultGroupName : settings.i18n.unlisted);
            settings.groups = [settings.defaultGroupName];
            settings.users.forEach(function (user, i) {
                if (user.group === undefined || user.group === '') {
                    user.group = settings.defaultGroupName;
                }
                else if (settings.groups.indexOf(user.group) == -1) {
                    settings.groups.push(user.group);
                }
            });
            settings.groups.unlisted = 0; //stores the id of the unlisted group
            settings.groups.added = [];
            settings.groups.forEach(function (e, i) {
                if (i !== 'added' && i !== settings.defaultGroupName && getUsersInGroup(e).length > 0) {
                    generateGroupTab(e, i);
                    settings.groups.added.push({
                        name: e,
                        id: 'user-group-' + i
                    });
                }
            });
        };

        /* init users */
        var initUsers = function () {
            console.warn('CALL FUNCTION: initUsers');

            settings.users.forEach(function (user, i) {
                user.isShowed = userLineIsShowed(user);
                user.lineHeight = getUserLineHeight(user);
                user.index = i;
            });
        };

        /* Update the content of the datepicker */
        var updateDatePicker = function () {
            console.log('CALL FUNCTION: updateDatePicker');
            $('#header-datetimepicker').datetimepicker()
                .data('DateTimePicker').locale(settings.locale)
                .defaultDate(settings.date.selected)
                .date(settings.date.selected)
                .viewDate(settings.date.selected)
                .enabledHours(false)
                .format((settings.currentDisplay === 'months' ? 'MM/YYYY' : 'L'))
                .viewMode((settings.currentDisplay === 'months' ? 'months' : 'days'));

        };

        /* Go to the next month/day */
        var goForward = function () {
            console.warn('CALL FUNCTION: goForward');
            closeInfoBox('task');
            if (settings.currentDisplay == 'months') {
                settings.date.selected = moment(settings.date.selected).add(1, 'months');
            } else {
                settings.date.selected = moment(settings.date.selected).add(1, 'day');
            }
            //updateDisplay(settings.currentDisplay);
        };

        /* Go to the previous month/day */
        var goBackward = function () {
            console.warn('CALL FUNCTION: goBackward');
            closeInfoBox('task');
            if (settings.currentDisplay == 'months') {
                settings.date.selected = moment(settings.date.selected).add(-1, 'months');
            } else {
                settings.date.selected = moment(settings.date.selected).add(-1, 'day');
            }
            //updateDisplay(settings.currentDisplay);
        };

        /* Return true if the first date contains the second one */
        var isDateInDate = function (origin, date) {
            console.log('CALL FUNCTION: isDateInDate');
            if ((moment(date.start_date) <= moment(origin.start_date) && moment(date.end_date) >= moment(origin.end_date))
                || (moment(date.start_date) >= moment(origin.start_date) && moment(date.start_date) <= moment(origin.end_date))
                || (moment(date.end_date) <= moment(origin.end_date) && moment(date.end_date) >= moment(origin.start_date))) {
                return true;
            }
            return false;
        };

        /* Return a task from his Id */
        var getTaskById = function (taskId) {
            console.log('CALL FUNCTION: getTaskById: taskId: ' + taskId);
            if (!settings.tasks) return;

            var task;
            settings.tasks.forEach(function (e) {
                if (e.id === taskId) {
                    task = e;
                }
            });
            return task;
        };

        /* Return true if the user has tasks for the selected month/day */
        var userHasTask = function (user) {
            console.log('CALL FUNCTION: userHasTask: user: ' + user.name);

            var response = false;
            var originDates = {
                start_date: (settings.currentDisplay == 'days' ? moment(settings.date.selected).startOf('day') : moment(settings.date.selected).startOf('month')),
                end_date: (settings.currentDisplay == 'days' ? moment(settings.date.selected).endOf('day') : moment(settings.date.selected).endOf('month'))
            };
            user.tasks.forEach(function (task) {
                if (isDateInDate(originDates, task) == true) {
                    response = true;
                }
            });
            return response;
        };

        /* Get the height of a user line */
        var getUserLineHeight = function (user) {
            console.log('CALL FUNCTION: getUserLineHeight: user: ' + user.name);

            var tasks = [];
            var lineIsHidden = user.isShowed;
            var originDates = {
                start_date: (settings.currentDisplay == 'days' ? moment(settings.date.selected).startOf('day') : moment(settings.date.selected).startOf('month')),
                end_date: (settings.currentDisplay == 'days' ? moment(settings.date.selected).endOf('day') : moment(settings.date.selected).endOf('month'))
            };
            user.tasks.forEach(function (task) {
                if (settings.hideEmptyLines && tasks.indexOf(task.id) < 0 && isDateInDate(originDates, task) == true) {
                    tasks.push(task.id);
                } else if (!settings.hideEmptyLines && tasks.indexOf(task.id) < 0 && lineIsHidden == true) {
                    tasks.push(task.id);
                }
            });
            return tasks.length * 40;
        };

        /* Return true if user task must be showed */
        var userLineIsShowed = function (user) {
            console.log('CALL FUNCTION: userLineIsShowed: user: ' + user.name);
            var response = 0,
                originDates = {
                start_date: (settings.currentDisplay == 'days' ? moment(settings.date.selected).startOf('day') : moment(settings.date.selected).startOf('month')),
                end_date: (settings.currentDisplay == 'days' ? moment(settings.date.selected).endOf('day') : moment(settings.date.selected).endOf('month'))
            };
            if (!user.tasks) return generateNotification('warning', '<b>' + user.name + '</b> ' + settings.i18n.notif.userHasNoTask);
            user.tasks.forEach(function (task) {
                if (isDateInDate(originDates, task)) response++;
            });
            return ((response > 0) || settings.hideEmptyLines === false);
        };

        /* Move task label on horizontal scroll */
        var setTaskLabelPosition = function () {
            console.log('CALL FUNCTION: setTaskLabelPosition');

            if (settings.disableLabelsMovement) return;
            var $elements = $('.pts-line-marker:has(> .pts-line-marker-label)'),
                limit = parseInt($('.pts-line-title-container').offset().left + $('.pts-line-title-container').width());
            $.each($elements, function() {
                var $label = $(this).children(),
                    right = parseInt($(this).offset().left) + parseInt($(this).width()) - parseInt($label.width()),
                    left = parseInt($(this).offset().left);
                if (left < limit && right > limit + 20) {
                    $label.css('left', $('.pts-scheduler-container').scrollLeft() - parseInt($(this).css('left')) + 10);
                } else {
                    $label.css('left', '10px');
                }

            });
        };

        /* Return an array of the index of the users that are in the specified group */
        var getUsersInGroup = function (groupName) {
            console.log('CALL FUNCTION: getUsersInGroup: groupName' + groupName);

            var inGroup  =[];

            settings.users.forEach(function (user) {
                if (user.group == groupName) {
                    inGroup.push(user.index);
                }
            });
            return inGroup;
        };

        /* Open the info-box panel */
        var openInfoBox = function (taskId, userIndex, viewType) {
            console.warn('CALL FUNCTION: openInfoBox: taskId: ' + taskId + ': userIndex: ' + userIndex + ': viewType: ' + viewType);

            var $infoBox = $('#pts-info-box-container');
            $infoBox.empty();

            switch (viewType) {
                case 'task':
                    var task = getTaskById(taskId),
                        $markers = $('.pts-line-marker');
                    generateInfoBoxContentTask(task, settings.users[userIndex]);
                    $.each($markers, function () {
                        $(this).css('background-color', getTaskById($(this).attr('data-task')).color);
                        if ($(this).attr('data-task') !== taskId) {
                            $(this).css('background-color', '#8e8e8e');
                        }
                    });
                    $('.pts-main-group-column').css('background-color', '#eee');
                    $infoBox.attr('data-toggle', 'opened');
                    break;
                case 'user':
                    var user = settings.users[userIndex];
                    generateInfoBoxContentUser(user);
                    $infoBox.attr('data-toggle', 'opened');
                    break;
                case 'createTask':
                    generateInfoBoxContentCreateTask();
                    $infoBox.attr('data-toggle', 'opened');
                    break;
                case 'assignTask':
                    generateInfoBoxContentAssignTask(taskId);
                    $infoBox.attr('data-toggle', 'opened');
                    break;
                case 'editTask':
                    generateInfoBoxContentEditTask(taskId);
                    $infoBox.attr('data-toggle', 'opened');
                    break;
                case 'createUser':
                    generateInfoBoxContentCreateUser();
                    $infoBox.attr('data-toggle', 'opened');
                    break;
                default:
                    return;
            }

            $infoBox.animate({
                width: '460px'
            }, 300);
            getContrastedColor();
        };

        /* Close the info-box panel */
        var closeInfoBox = function () {
            console.warn('CALL FUNCTION: closeInfoBox');

            var $infoBox = $('#pts-info-box-container'),
                $markers = $('.pts-line-marker');
            if ($infoBox.attr('data-toggle') === 'closed') return;
            $.each($markers, function () {
                var task = getTaskById($(this).attr('data-task'));
                $(this).css('background-color', (task ? task.color : settings.defaultColor));
            });

            $('.pts-main-group-column').css('background-color', '#fff');
            $infoBox.animate({
                width: '0%'
            }, 300);
            $infoBox.attr('data-toggle', 'closed');
            $infoBox.empty();
            getContrastedColor();
        };

        /* Mix tasks that have a superposition */
        var hideTaskSuperposition = function (originIndex, task, user) {
            console.log('CALL FUNCTION: hideTaskSuperposition: originIndex: ' + originIndex + ':task: ' + task.name + ': user: ' + user.name);

            user.tasks.forEach(function (userTask, index) {
                if (userTask.id === task.id && index !== originIndex) {
                    if (moment(userTask.start_date).format('YYYYMMDD') ==  moment(task.end_date).format('YYYYMMDD')  &&
                        ((moment(userTask.start_date).format('H') <= 12 && moment(task.end_date).format('H') <= 12) ||
                        (moment(userTask.start_date).format('H') > 12 && moment(task.end_date).format('H') > 12))) {
                        task.end_date = userTask.end_date;
                    }
                    if (moment(task.start_date).format('YYMMDD') == moment(userTask.end_date).format('YYMMDD')&&
                        ((moment(task.start_date).format('H') <= 12 && moment(userTask.end_date).format('H') <= 12) ||
                        (moment(task.start_date).format('H') > 12 && moment(userTask.end_date).format('H') > 12))) {
                        task.disabled = true;
                    }
                }
            });
            return task;
        };

        /* Check which color match with the element background color */
        var getContrastedColor = function () {
            console.log('CALL FUNCTION: getContrastedColor');

            $('.pts-check-color').each(function () {
                var rgb = $(this).css('background-color').match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                if (rgb && rgb.length == 4) {
                    var L = (rgb[1] * 0.299 + rgb[2] * 0.587 + rgb[3] * 0.114) / 255;
                    if (L > 0.60) {
                        $(this).children().css('color', '#000');
                        $(this).css('color', '#000');
                    }
                    else {
                        $(this).children().css('color', '#fff');
                        $(this).css('color', '#fff');
                    }
                }
            });
        };

        /* Switch the list view date range */
        var switchListRange = function (range) {
            console.log('CALL FUNCTION: switchListRange: range: ' + range);

            $('.pts-list-tasks-container').empty();
            switch (range) {
                case 'all':
                    settings.list.start_date = moment();
                    settings.list.end_date = moment();
                    var $content =  '<h4 style="margin:0 0 15px 15px"><b>' + settings.i18n.all + ' :</b></h4>';
                    $('.pts-list-tasks-container').append($content);
                    break;
                case 'today':
                    settings.list.start_date = moment().startOf('day');
                    settings.list.end_date = moment().endOf('day');
                    var $content =  '<h4 style="margin:0 0 15px 15px"><b>' + settings.i18n.from + '</b> ' + settings.list.start_date.locale(settings.locale).format('lll') +
                        ' <b>' + settings.i18n.to + '</b> ' + settings.list.end_date.locale(settings.locale).format('lll') + ' :</h4>';
                    $('.pts-list-tasks-container').append($content);
                    break;
                case 'week':
                    settings.list.start_date = moment().startOf('week');
                    settings.list.end_date = moment().endOf('week');
                    var $content =  '<h4 style="margin:0 0 15px 15px"><b>' + settings.i18n.from + '</b> ' + settings.list.start_date.locale(settings.locale).format('lll') +
                        ' <b>' + settings.i18n.to + '</b> ' + settings.list.end_date.locale(settings.locale).format('lll') + ' :</h4>';
                    $('.pts-list-tasks-container').append($content);
                    break;
                case 'month':
                    settings.list.start_date = moment().startOf('month');
                    settings.list.end_date = moment().endOf('month');
                    var $content =  '<h4 style="margin:0 0 15px 15px"><b>' + settings.i18n.from + '</b> ' + settings.list.start_date.locale(settings.locale).format('lll') +
                        ' <b>' + settings.i18n.to + '</b> ' + settings.list.end_date.locale(settings.locale).format('lll') + ' :</h4>';
                    $('.pts-list-tasks-container').append($content);
                    break;
                case 'year':
                    settings.list.start_date = moment().startOf('year');
                    settings.list.end_date = moment().endOf('year');
                    var $content =  '<h4 style="margin:0 0 15px 15px"><b>' + settings.i18n.from + '</b> ' + settings.list.start_date.locale(settings.locale).format('lll') +
                        ' <b>' + settings.i18n.to + '</b> ' + settings.list.end_date.locale(settings.locale).format('lll') + ' :</h4>';
                    $('.pts-list-tasks-container').append($content);
                    break;
                case 'personalized':
                    var $content =  '<h4 style="margin:0 0 15px 15px"><b>' + settings.i18n.from + '</b> ' + settings.list.start_date.locale(settings.locale).format('lll') +
                                    ' <b>' + settings.i18n.to + '</b> ' + settings.list.end_date.locale(settings.locale).format('lll') + ' :</h4>';
                    $('.pts-list-tasks-container').append($content);
                    break;
            }
            settings.tasks.forEach(function (task) {
                if ($('.pts-list-task-enabler-input[data-task=' + task.id + ']').is(':checked')) {
                    generateListTaskContent(task);
                }
            });
        };

        /* Create a task */
        var createNewTask = function (name, id, description, color, assign) {
            console.warn('CALL FUNCTION: createNewTask');

            var newTask = {
                id: (id.length > 0 ? id : generateRandomId()),
                name: name,
                description: (description.length > 0 ? description : ''),
                color: (color.length > 0 ? color : settings.defaultColor)
            };
            newTask = generateTaskInTask(newTask);
            settings.tasks.push(newTask);
            if (settings.onTaskCreation && typeof settings.onTaskCreation === 'function') {
                settings.onTaskCreation(settings);
            }
            if (settings.onChange && typeof settings.onChange === 'function') {
                settings.onChange(settings);
            }
            generateNotification('success', settings.i18n.notif.taskCreated + ' : <b>' + newTask.name + '</b>');
            if (assign == true) return openInfoBox(newTask.id, null, 'assignTask');
        };

        /* Generate a random Id */
        var generateRandomId = function () {
            console.log('CALL FUNCTION: generateRandomId');

            var S4 = function() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            };
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        };

        /* Remove a task */
        var removeTask = function (taskId) {
            console.warn('CALL FUNCTION: removeTask');

            $.each(settings.tasks, function (i, task) {
                if (task && task.id === taskId) {
                    delete settings.tasks[i];
                }
            });
            $.each(settings.users, function (userIndex, user) {
                $.each(user.tasks, function (taskIndex, task) {
                    if (task && task.id === taskId) {
                       delete settings.users[userIndex].tasks[taskIndex];
                    }
                });
            });
            updateDisplay(settings.currentDisplay);
            if (settings.onTaskRemoval && typeof settings.onTaskRemoval === 'function') {
                settings.onTaskRemoval(settings);
            }
            if (settings.onChange && typeof settings.onChange === 'function') {
                settings.onChange(settings);
            }
            generateNotification('success', settings.i18n.notif.taskRemoved);
        };

        /* Assign users to a task */
        var assignUsersToTask = function (users, task, start_date, end_date) {
            console.warn('CALL FUNCTION: assignUsersToTask');

            var taskDates = {
                    start_date: start_date,
                    end_date: end_date
                };

            $('#pts-assign-task-err').empty();
            if (!users || !task || !start_date || ! end_date) return;

            users.forEach(function (userIndex) {
                var user = settings.users[userIndex],
                    taskExist = false;
                user.tasks.forEach(function (_task) {
                    if (_task.id === task.id && (isDateInDate(_task, taskDates) || isDateInDate(taskDates, _task))) {
                        taskExist = true;
                    }
                });
                if (taskExist) {
                    return $('#pts-assign-task-err').append('<b>' + user.name + '</b> ' + settings.i18n.userIsAlreadyAssigned + '<br>');
                }
               user.tasks.push({
                   id: task.id,
                   start_date: moment(start_date).format('YYYY-MM-DD HH:mm'),
                   end_date: moment(end_date).format('YYYY-MM-DD HH:mm')
               });
                generateTaskInTask(task);
                if ($('.pts-info-box-user[data-user=' + user.index + ']').length == 0) {
                    var $head = '<hr><div class="pts-info-box-user animated fadeIn" data-user="' + user.index + '"><h4 class=" text-semibold heading-divided">' + user.name + '</h4>' +
                                '<table><tbody class="pts-info-box-user-list" data-head="' + user.index + '"></tbody></table></div>';
                    $('#pts-info-box-container > .panel-body').append($head);
                }
                var $userTasks =    ['<tr class="animated fadeIn"><td>',
                                    '<i class="glyphicon glyphicon-trash pts-task-assign-delete-user" data-user="' + user.index + '" data-task="' + task.id + '" data-task-index="' + (user.tasks.length - 1) + '"></i>',
                                    '<b>' + settings.i18n.from + '</b> ' + moment(start_date).locale(settings.locale).format('llll'),
                                    ' <b>' + settings.i18n.to + '</b> ' + moment(end_date).locale(settings.locale).format('llll') + '</td></tr>'].join('\n');
                $('.pts-info-box-user-list[data-head=' + user.index + ']').append($userTasks);
                $('#pts-info-box-container').scrollTop($('#pts-info-box-container')[0].scrollHeight);
            });
            if (settings.onTaskAssignation && typeof settings.onTaskAssignation === 'function') {
                settings.onTaskAssignation(settings);
            }
            if (settings.onChange && typeof settings.onChange === 'function') {
                settings.onChange(settings);
            }
            generateNotification('success', '<b>' + users.length + '</b> ' + ( users.length > 1 ? settings.i18n.notif.usersAssigned: settings.i18n.notif.userAssigned) + ' <b>' + task.name + '</b>');
        };

        /* Delete a task line from an user */
        var deleteTaskFromUser = function (user, task, taskIndex) {
            console.warn('CALL FUNCTION: deleteTaskFromUser');

            if (!user.tasks[taskIndex]) return;

            delete user.tasks[taskIndex];
            generateTaskInTask(task);
            if (settings.onUserTaskDeletion && typeof settings.onUserTaskDeletion === 'function') {
                settings.onUserTaskDeletion(settings);
            }
            if (settings.onChange && typeof settings.onChange === 'function') {
                settings.onChange(settings);
            }
            generateNotification('success', '<b>' + user.name + '</b> ' + settings.i18n.notif.userUnassigned);
        };

        /* Edit the informations of an existing task */
        var editTask = function (task, newData) {
            console.warn('CALL FUNCTION: editTask');

            task.name = (newData.name ? newData.name : task.name);
            task.color = (newData.color ? newData.color : task.color);
            task.description = (newData.description ? newData.description : task.description);
            updateDisplay(settings.currentDisplay);
            if (settings.onTaskEdition && typeof settings.onTaskEdition === 'function') {
                settings.onTaskEdition(settings);
            }
            if (settings.onChange && typeof settings.onChange === 'function') {
                settings.onChange(settings);
            }
            generateNotification('success', settings.i18n.notif.taskInformationsUpdated);
        };

        /*create a new user */
        var createNewUser = function (name, group, assign) {
            console.warn('CALL FUNCTION: createNewUser');

            /*if (!group) {
                if (!settings.groups.unlisted) {
                    settings.groups.push(settings.i18n.unlisted);
                    settings.groups.unlisted = settings.groups.length - 1;
                }
                group = settings.i18n.unlisted;
            } else if (settings.groups.indexOf(group) == -1) {
                settings.groups.push(group);
            }*/

            settings.users.push({
                name: name,
                group: (group ? group : ''),
                tasks: []
            });

            if (settings.onUserCreation && typeof settings.onUserCreation === 'function') {
                settings.onUserCreation(settings);
            }
            if (settings.onChange && typeof settings.onChange === 'function') {
                settings.onChange(settings);
            }
            generateNotification('success', settings.i18n.notif.userCreated + ' : <b>' + name + '</b>');
            initGroup();
            if (assign == true) return openInfoBox(null, settings.users.length - 1, 'assignUser');
            updateDisplay(settings.currentDisplay);
        };


        /********* Generation *********/

        /* Generate the header content */
        var generateHeader = function () {
            console.warn('CALL FUNCTION: generateHeader');

            var $header =   ['<div id="pts-notification-container"></div>',
                            '<div class="pts-header row">',
                            '<div class="pts-header-left-container pull-left">',
                            '<div class="form-group">',
                            '<div class="input-group date" id="header-datetimepicker">',
                            '<input type="text" class="form-control"/>',
                            '<span class="input-group-addon">',
                            '<span class="glyphicon glyphicon-calendar"></span>',
                            '</span></div></div>',
                            '<div class="pts-nav-buttons">',
                            '<button class="btn pts-btn-previous"><i class="glyphicon glyphicon-chevron-left"></i></button>',
                            '<button class="btn pts-btn-next"><i class="glyphicon glyphicon-chevron-right"></i></button>',
                            '</div>',
                            '<span class="pts-header-date-display">',
                            (settings.currentDisplay === "months" ? moment(settings.date.selected).locale(settings.locale).format('MMMM YYYY') : moment(settings.date.selected).locale(settings.locale).format('LL')),
                            '</span></div>',
                            '<div class="pts-header-right-container pull-right">',
                            '<button class="btn btn-sm pts-btn-day-view ' + (settings.currentDisplay === "days" ? "pts-active" : "") + '">' + settings.i18n.days + '</button>',
                            '<button class="btn btn-sm pts-btn-month-view ' + (settings.currentDisplay === "months" ? "pts-active" : "") + '">' + settings.i18n.months + '</button>',
                            '<button class="btn btn-sm pts-btn-list-view" ' + (settings.currentDisplay === "list" ? "pts-active" : "") + '>' + settings.i18n.list + '</button></div></div>'].join('\n');

            $scheduler.append($header);
            updateDatePicker();
        };

        /* Generate base empty base structure */
        var generateBaseView = function () {
            console.warn('CALL FUNCTION: generateBaseView');

            if ($('.pts-main-container').length) return;
            var $mainContainer =    ['<div class="pts-main-container row">',
                                    '<div id="pts-info-box-container" data-toggle="closed"></div>',
                                    '<div class="pts-corner-mask"></div>',
                                    '<div class="pts-column-title-container">',
                                    '<div></div></div>',
                                    '<div class="pts-line-title-container"><div>',
                                    '</div></div>',
                                    '<div class="pts-scheduler-container">',
                                    '<div class="pts-main-content">',
                                    '</div></div></div>'].join('\n');

            $scheduler.append($mainContainer);
        };

        /* Launch all the main generations */
        var generateMainContent = function () {
            console.warn('CALL FUNCTION: generateMainContent');

            generateBaseView();
            generateTableLines();
            initGroup();
            generateGroupMainContent();
            generateUsersList();
            updateDatePicker();
        };

        /* Generate the table columns lines */
        var generateTableLines = function () {
            console.warn('CALL FUNCTION: generateTableLines');

            initUsers();
            $('.pts-column-title-container > div').empty();
            $('.pts-main-content').empty();
            $('.pts-corner-mask').empty();
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
                var dayDate = moment(settings.date.selected).add(-1 * (moment(settings.date.selected).format('D') - 1), 'day'),
                    lineInterval = 0,
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
            var $settingsMenu = ['<div style="display:inline-flex"><div class="dropdown" style="top:2px"><button id="addDropdown" class="btn btn-sm pts-btn-add-elem dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                                '<i class="glyphicon glyphicon-plus"></i></button>',
                                '<ul class="dropdown-menu" aria-labelledby="addDropdown">',
                                '<li><a href="#" class="pts-add-new-task">' + settings.i18n.addNewTask + '</a></li>',
                                '<li><a href="#" class="pts-add-new-user">' + settings.i18n.addNewUser + '</a></li>',
                                '</ul></div><div class="dropdown">',
                                '<button class="btn btn-default dropdown-toggle" type="button" id="settingsDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                                settings.i18n.settings + ' <span class="caret"></span></button>',
                                '<ul class="dropdown-menu" aria-labelledby="settingsDropdown">',
                                '<li><label class="checkbox-inline"><input id="hide-user-btn" type="checkbox" value="" ' + (settings.hideEmptyLines ? 'checked' : '') + '>'+ settings.i18n.hideEmptyLine +'</label></li>',
                                '<li><label class="checkbox-inline"><input id="disable-labels-mov" type="checkbox" value="" ' + (settings.disableLabelsMovement ? 'checked' : '') + '>'+ settings.i18n.disableLabelsMovement +'</label></li>',
                                '</div></div>'].join('\n');
            $('.pts-corner-mask').append($settingsMenu);
        };

        /* Add one group to the scheduler */
        var generateGroupTab = function (group, index) {
            console.log('CALL FUNCTION: generateGroupTab: group: ' + group);

            var $groupHeaderContent =   ['<div id="user-group-' + index + '" class="pts-line-group-container">',
                                        '<div class="pts-group-header">',
                                        '<i class="glyphicon glyphicon-remove pull-left close-group-panel" data-group="' + index + '" data-toggle="opened"></i>',
                                        '<span>' + group + '</span></div>',
                                        '<div class="pts-group-content"></div></div>'].join('\n');
            $('.pts-line-title-container > div').append($groupHeaderContent);
        };

        /* Generate the main group content and header */
        var generateGroupMainContent = function () {
            console.log('CALL FUNCTION: generateGroupMainContent');

            if (!settings.groups) return;
            settings.groups.added.forEach(function (group, groupIndex) {
                var $groupMainContent = [
                    '<div id="group-container-' + groupIndex + '" class="pts-main-group-container">',
                    '<div class="pts-main-group-header"></div></div>'].join('\n');
                $('.pts-main-content').append($groupMainContent);
                settings.users.forEach(function (user, userIndex) {
                    var userLineHeight = user.lineHeight;
                    if (user.group === group.name && user.isShowed == true && userLineHeight > 0) {
                        $('#group-container-' + groupIndex).append('<div id="content-user-' + userIndex + '" class="pts-main-group-user" style="height:' + userLineHeight + 'px"></div>');
                    }
                });
                if ($('.close-group-panel[data-group='+groupIndex+']').attr('data-toggle') === 'closed') {
                    $('#group-container-' + groupIndex).children('.pts-main-group-user').css('display', 'none');
                }
            });
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
            console.warn('CALL FUNCTION: generateUsersList');
            if (!settings.users || settings.users.length <= 0) return generateNotification('danger', settings.i18n.notif.noUser );

            $('.pts-group-content').empty();
            settings.users.forEach(function (user) {
                var group = '';
                settings.groups.added.forEach(function (_group) {
                    if (_group.name == user.group || (user.id && _group.users && _group.users.indexOf(user.id) >= 0)) {
                        group = _group.id;
                    }
                });
                if (!group) {
                    if (!settings.groups.unlisted) {
                        generateGroupTab(settings.i18n.unlisted, settings.groups.added.length);
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
            console.log('CALL FUNCTION: generateUserLine: user: ' + user.name);

            if (!user.tasks) return console.warn('Warning: user ' + user.name + ' is assigned to any task');
            if (!user.isShowed || user.lineHeight <= 0) return;

            var $userNameUI = '<div class="pts-group-user" style="height:' + user.lineHeight + 'px" data-user="' + user.index + '"><p>' + user.name + '</p></div>';

            $('#' + group + ' > .pts-group-content').append($userNameUI);

        };

        /* Generate the tasks lines */
        var generateTaskLines = function (user, userIndex) {
            console.warn('CALL FUNCTION: generateTaskLines: user: ' + user.name);

            if (!userHasTask(user)) return console.log('No task for this user in that period');
            user.index = userIndex;
            var topDistance = 5;
            if (!user.tasks) return;
            user.tasks.forEach(function (e, i) {
                var task = $.extend(getTaskById(e.id), e);
                if (task === undefined) return generateNotification('warning', '<b>' + user.name + '</b> ' + settings.i18n.notif.taskNotExist);
                task.disabled = false;
                task.index = i;
                if (task === undefined) return console.warn('CALL FUNCTION: Warning: Task ' + e.id + ' has not be found in tasks array for user ' + user.name);
                if (task.start_date > task.end_date) return console.warn('CALL FUNCTION: Warning: end_date must be later than start_date for user ' + user.name + 'in task ' + e.id);
               if (settings.currentDisplay === 'months') {
                  task = hideTaskSuperposition(i, task, user);
                   if (task.end_date && task.disabled != true) {
                       if (moment(settings.date.selected).format('YYYYMM') >= moment(task.start_date).format('YYYYMM')
                           && moment(settings.date.selected).format('YYYYMM') <= moment(task.end_date).format('YYYYMM')) {
                           topDistance += generateTaskLineMonth(user, task, topDistance);
                       }
                   }
               }
               else if (settings.currentDisplay === 'days') {
                   if (task.end_date) {
                       if (moment(settings.date.selected).format('YYYYMMDD') >= moment(task.start_date).format('YYYYMMDD')
                           && moment(settings.date.selected).format('YYYYMMDD') <= moment(task.end_date).format('YYYYMMDD')) {
                                topDistance += generateTaskLineDay(user, task, topDistance);
                       }
                   }
               }
                delete task.disabled;
                delete task.index;
                delete task.start_date;
                delete task.end_date;
            });
        };

        /* Generate one task on the month view */
        var generateTaskLineMonth = function (user, task, topDistance) {
            console.warn('CALL FUNCTION: generateTaskLineMonth: user: ' + user.name + ':task: ' + task.name);

            var userIndex = user.index;
            var existingTaskLine = $('div[data-task=' + task.id + '][data-user=' + userIndex + '] > .pts-line-marker');

            if (existingTaskLine.length > 0) {
                topDistance = existingTaskLine.css('top');
            }

            $('#content-user-' + userIndex).append('<div class="pts-line-marker-group-' + task.index + '" data-task="' + task.id + '" data-user="' + userIndex + '"></div>');

            // If the task start date is in the current month
            if (moment(settings.date.selected).format('YYYYMM') == moment(task.start_date).format('YYYYMM')) {
                var splitted = (moment(task.start_date).format('H') >= 12 ? 60 : 0),
                    leftDistance = (120 * (moment(task.start_date).format('D') - 1)) + splitted - 6,
                    label_end = false;

                if (moment(task.end_date).format('YYYYMM') > moment(settings.date.selected).format('YYYYMM')) {
                    var labelWidth = 120 * (parseInt(moment(settings.date.selected).daysInMonth()) - parseInt(moment(task.start_date).format('D'))) + (splitted == 0 ? 120 : 60);
                } else {
                    var labelWidth = 120 * (moment(task.end_date).format('D') - moment(task.start_date).format('D') ) + (splitted == 0 ? 120 : 60) - (moment(task.end_date).format('H') <= 12 ? 60 : 0);
                    label_end = true;
                }
                topDistance = parseInt(topDistance);
                leftDistance = parseInt(leftDistance);
                var $task = '<div class="pts-check-color progress-bar-striped pts-line-marker '+ (label_end ? 'complete' : 'start') +
                            '" style="top:'+topDistance+'px;left:'+ leftDistance +'px;background-color:' + task.color + ';width:'+labelWidth+'px" data-task="' + task.id + '" data-user="' + userIndex + '">' +
                            '<p class="pts-line-marker-label text-no-select" data-toggle="tooltip" title="' + task.name + '">' + task.name + '</p></div>';
                $('#content-user-' + userIndex + ' > .pts-line-marker-group-' + task.index).append($task);
            }

            // If the task end date is in the current month but not the start date
            if (moment(settings.date.selected).format('YYYYMM') == moment(task.end_date).format('YYYYMM')) {
                if (moment(task.start_date).format('YYYYMM') < moment(settings.date.selected).format('YYYYMM')) {

                    var splitted = (moment(task.end_date).format('H') <= 12 ? 60 : 0);
                    var labelWidth = 120 * (moment(task.end_date).format('D')) - splitted;

                    topDistance = parseInt(topDistance);
                    var $task = '<div class="pts-check-color progress-bar-striped pts-line-marker end" style="top:' + topDistance + 'px;left:0px;background-color:' + task.color + ';width:'+labelWidth+'px" data-task="' + task.id + '" data-user="' + userIndex + '">' +
                                 '<p class="pts-line-marker-label text-no-select" data-toggle="tooltip" title="' + task.name + '">' + task.name + '</p></div>';
                    $('#content-user-' + userIndex + ' > .pts-line-marker-group-' + task.index).append($task);
                }
            }

            // If the task start and end dates are not in the current month but the task is
            if (moment(settings.date.selected).format('YYYYMM') != moment(task.end_date).format('YYYYMM') && moment(settings.date.selected).format('YYYYMM') != moment(task.start_date).format('YYYYMM')) {
                topDistance = parseInt(topDistance);
                var $task = '<div class="pts-check-color progress-bar-striped pts-line-marker middle" style="top:' + topDistance + 'px;left:0px;background-color:' + task.color + ';" data-task="' + task.id + '" data-user="' + userIndex + '">' +
                             '<p class="pts-line-marker-label text-no-select" data-toggle="tooltip" title="' + task.name + '">' + task.name + '</p></div>';
                $('#content-user-' + userIndex + ' > .pts-line-marker-group-' + task.index).append($task);
            }
            setTaskLabelPosition();
            getContrastedColor();
            return (existingTaskLine.length > 0 ? 0 : 40);
        };

        /* Generate one task on the month view */
        var generateTaskLineDay = function (user, task, topDistance) {
            console.warn('CALL FUNCTION: generateTaskLineDay: user: ' + user.name + ': task: ' + task.name);

            var userIndex = user.index;
            var existingTaskLine = $('div[data-task=' + task.id + '][data-user=' + userIndex + '] > .pts-line-marker');

            if (existingTaskLine.length > 0) {
                topDistance = existingTaskLine.css('top');
            }

            $('#content-user-' + userIndex).append('<div class="pts-line-marker-group-' + task.index + '" data-task="' + task.id + '" data-user="' + userIndex + '"></div>');

            // If the task start date is in the current month
            if (moment(settings.date.selected).format('YYYYMMDD') == moment(task.start_date).format('YYYYMMDD')) {
                var splitted = (moment(task.start_date).format('mm') >= 30 ? 60 : 0),
                    leftDistance = (120 * (moment(task.start_date).format('H') )) + splitted - 6,
                    label_end = false;

                if (moment(task.end_date).format('YYYYMMDD') > moment(settings.date.selected).format('YYYYMMDD')) {
                    var taskWidth = 120 * (24 - parseInt(moment(task.start_date).format('H')) - 1) + (splitted == 0 ? 120 : 60);
                } else {
                    var taskWidth = 120 * (moment(task.end_date).format('H') - moment(task.start_date).format('H')) + (splitted == 0 ? 120 : 60)  - (moment(task.end_date).format('mm') < 30 ? 120 : 60);
                    label_end = true;
                }
                topDistance = parseInt(topDistance);
                leftDistance = parseInt(leftDistance);
                var $task = '<div class="pts-check-color progress-bar-striped pts-line-marker '+ (label_end ? 'complete' : 'start') +
                            '" style="top:'+topDistance+'px;left:'+ leftDistance +'px;background-color:' + task.color + ';width:'+taskWidth+'px" data-task="' + task.id + '" data-user="' + userIndex + '">' +
                             '<p class="pts-line-marker-label text-no-select" data-toggle="tooltip" title="' + task.name + '">' + task.name + '</p></div>';
                $('#content-user-' + userIndex + ' > .pts-line-marker-group-' + task.index).append($task);
            }

            // If the task end date is in the current month but not the start date
            if (moment(settings.date.selected).format('YYYYMMDD') == moment(task.end_date).format('YYYYMMDD')) {
                if (moment(task.start_date).format('YYMMDD') < moment(settings.date.selected).format('YYMMDD')) {
                    var splitted = (moment(task.end_date).format('mm') < 30 ? 120 : 60);
                    var taskWidth = 120 * (moment(task.end_date).format('H')) - splitted + 120;

                    topDistance = parseInt(topDistance);
                    var $task = '<div class="pts-check-color progress-bar-striped pts-line-marker end" style="top:' + topDistance + 'px;left:0px;background-color:' + task.color + ';width:'+taskWidth+'px" data-task="' + task.id + '" data-user="' + userIndex + '">' +
                                 '<p class="pts-line-marker-label text-no-select" data-toggle="tooltip" title="' + task.name + '">' + task.name + '</p></div>';
                    $('#content-user-' + userIndex + ' > .pts-line-marker-group-' + task.index).append($task);
                }
            }

            // If the task start and end dates are not in the current month but the task is
            if (moment(settings.date.selected).format('YYYYMMDD') != moment(task.end_date).format('YYYYMMDD') && moment(settings.date.selected).format('YYYYMMDD') != moment(task.start_date).format('YYYYMMDD')) {
                topDistance = parseInt(topDistance);
                var $task = '<div class="pts-check-color progress-bar-striped pts-line-marker middle" style="top:' + topDistance + 'px;left:0px;background-color:' + task.color + ';" data-task="' + task.id + '" data-user="' + userIndex + '">' +
                             '<p class="pts-line-marker-label text-no-select" data-toggle="tooltip" title="' + task.name + '">' + task.name + '</p></div>';
                $('#content-user-' + userIndex + ' > .pts-line-marker-group-' + task.index).append($task);
            };
            setTaskLabelPosition();
            getContrastedColor();
            return (existingTaskLine.length > 0 ? 0 : 40);
        };

        /* Generate the tasks structure of the info box */
        var generateInfoBoxContentTask = function (task, user) {
            console.warn('CALL FUNCTION: generateInfoBoxContentTask: task: ' + task.name);

            var $content =  ['<div class="panel-body">',
                            '<h4 class="pts-check-color text-semibold pts-info-box-title progress-bar-striped pts-close-info-box" style="background-color:' + task.color + '">' + task.name + '<i class="glyphicon glyphicon-remove pull-right"></i></h4>',
                            '<p><b>' + settings.i18n.description + ' : </b><br>' + (task.description ? task.description : settings.i18n.notSpecified) + '</p>',
                            '<div class="btn-group">',
                            '<button type="button" class="pts-delete-task-btn btn btn-danger" data-task="' + task.id + '" data-confirm="false">' + settings.i18n.remove + '</button>',
                            '<button type="button" class="btn pts-assign-task-btn" style="background-color:#00BCD4;color:#fff" data-task="' + task.id + '">' + settings.i18n.assign + '</button>',
                            '<button type="button" class="btn pts-edit-task-btn" style="background-color:#0097A7;color:#fff" data-task="' + task.id + '">' + settings.i18n.edit + '</button></div><br>',
                            '<br><div class="divider"></div></div>'].join('\n');
            $('#pts-info-box-container').append($content);

            $.each(task.users, function (i) {
                var user = settings.users[i];
                var $head = '<div class="pts-info-box-user"><h4 class=" text-semibold heading-divided">' + user.name + '</h4><table><tbody class="pts-info-box-user-list" data-head="' + i + '"></tbody></table></div>';
                $('#pts-info-box-container > .panel-body').append($head);
                user.tasks.forEach(function (_task) {
                    if (_task.id === task.id) {
                        $('.pts-info-box-user-list[data-head=' + i + ']').append('<tr><td><b>' + settings.i18n.from + '</b> ' + moment(_task.start_date).locale(settings.locale).format('llll') +
                            ' <b>' + settings.i18n.to + '</b> ' + moment(_task.end_date).locale(settings.locale).format('llll') + '</td></tr>');
                    }
                });
            });
            getContrastedColor();
        };

        /* Generate the users structure of the info box */
        var generateInfoBoxContentUser = function (user) {
            console.warn('CALL FUNCTION: generateInfoBoxContentUser: user: ' + user.name);

            var sortedTasks = {};
            user.tasks.forEach(function (e, i) {
                if (!sortedTasks[e.id]) {
                    sortedTasks[e.id] = [];
                }
                 sortedTasks[e.id].push('<i class="glyphicon glyphicon-trash pts-task-assign-delete-user" data-user="' + user.index + '" data-task="' + e.id + '" data-task-index="' + i + '"></i>' +
                                        '<b>' + settings.i18n.from + '</b> ' + moment(e.start_date).locale(settings.locale).format('lll') + '  <b>' + settings.i18n.to + '</b> ' + moment(e.end_date).locale(settings.locale).format('lll'));
            });
            var $content =  ['<div class="panel-body">',
                '<h4 class="text-semibold pts-info-box-title pts-close-info-box pts-check-color" style="background-color:#00BCD4" data-update="true">' + user.name + ' - <small style="color:#fff">' + user.group + '</small>',
                '<i class="glyphicon glyphicon-remove pull-right"></i></h4>',
                '<div class="pts-info-box-user-list"></div></div>'].join('\n');

            $('#pts-info-box-container').append($content);
            $.each(sortedTasks, function (i, _task) {
                var originalTask = getTaskById(i);
                var $line = ['<p class="pts-check-color progress-bar-striped pts-info-box-task-header" style="background-color:' +originalTask.color + ';margin-top:10px" data-task="' + i + '" data-user="' + user.index + '"><b>',
                            originalTask.name + '</b></p><table style="position: relative;left:30px;"><tbody class="pts-user-sorted-task" data-task="' + i + '" class="pts-info-box-user-list" data-head="' + user.index + '">',
                            '</tbody></table>'].join('\n');
                $('.pts-info-box-user-list').append($line);
                _task.forEach(function (_line) {
                    $('.pts-user-sorted-task[data-task=' + i + ']').append('<tr><td>' + _line + '</td></tr>');
                });
            });
            getContrastedColor();
        };

        /* Generate the creation task structure of the info box */
        var generateInfoBoxContentCreateTask = function () {
            console.warn('CALL FUNCTION: generateInfoBoxContentCreateTask');

            var $content = ['<div class="panel-body">',
                            '<h4 class="text-semibold pts-info-box-title pts-close-info-box pts-check-color" style="background-color:' + settings.defaultColor + '">' + settings.i18n.addNewTask,
                            '<i class="glyphicon glyphicon-remove pull-right"></i></h4>',
                            '<fieldset>',
                            '<div class="form-group"><label>' + settings.i18n.name + ' <small>(' + settings.i18n.required + ')</small> :</label><input id="pts-add-task-input-name" type="text" class="form-control" maxlength="50">',
                            '<div id="pts-add-task-err-name" style="color:red"></div></div>',
                            '<div class="form-group"><label>Id :</label><input id="pts-add-task-input-id" type="text" class="form-control" maxlength="80"><div id="pts-add-task-err-id" style="color:red"></div></div>',
                            '<div class="form-group"><label>' + settings.i18n.color + ' :</label><input id="pts-add-task-input-color" type="color" class="form-control" value="' + settings.defaultColor + '"></div>',
                            '<div class="form-group"><label>' + settings.i18n.description + ' :</label><textarea id="pts-add-task-input-description" type="text" class="form-control"  maxlength="255"></textarea></div>',
                            '<div class="btn-group">',
                            '<button type="button" class="pts-close-info-box btn btn-danger">' + settings.i18n.cancel + '</button>',
                            '<button type="button" class="btn pts-create-task-btn" style="background-color:#00BCD4;color:#fff" data-assign="true">' + settings.i18n.createAndAssign + '</button>',
                            '<button type="button" class="btn pts-create-task-btn" style="background-color:#0097A7;color:#fff" data-assign="false">' + settings.i18n.create + '</button></div>',
                            '</fieldset>',
                            '</div>'].join('\n');
            $('#pts-info-box-container').append($content);
        };

        /* Generate the edition task structure of the info box */
        var generateInfoBoxContentEditTask = function (taskId) {
            console.warn('CALL FUNCTION: generateInfoBoxContentEditTask');

            var task = getTaskById(taskId);
            if (!task) return;

            var $content = ['<div class="panel-body">',
                            '<h4 class="text-semibold pts-info-box-title pts-close-info-box pts-check-color progress-bar-striped" style="background-color:' + task.color + '">' + task.name,
                            '<i class="glyphicon glyphicon-remove pull-right"></i></h4>',
                            '<h4><i class="glyphicon glyphicon-chevron-left pull-left pts-info-box-back-btn" data-target="task" data-task="' + task.id + '"></i>' + settings.i18n.editTask + '</h4>',
                            '<fieldset>',
                            '<div class="form-group"><label>' + settings.i18n.name + ' <small>(' + settings.i18n.required + ')</small> :',
                            '</label><input id="pts-edit-task-input-name" type="text" class="form-control" maxlength="50" value="' + task.name + '">',
                            '<div id="pts-edit-task-err-name" style="color:red"></div></div>',
                            '<div class="form-group"><label>Id :</label><input id="pts-edit-task-input-id" type="text" class="form-control" maxlength="80" value="' + task.id + '" disabled="disabled"></div>',
                            '<div class="form-group"><label>' + settings.i18n.color + ' :</label><input id="pts-edit-task-input-color" type="color" class="form-control" value="' + task.color + '"></div>',
                            '<div class="form-group"><label>' + settings.i18n.description + ' :</label>',
                            '<textarea id="pts-edit-task-input-description" type="text" class="form-control"  maxlength="255">' + (task.description != undefined ? task.description : '') + '</textarea></div>',
                            '<div class="btn-group">',
                            '<button type="button" class="pts-close-info-box btn btn-danger">' + settings.i18n.cancel + '</button>',
                            '<button type="button" class="btn pts-edit-task-confirm-btn" style="background-color:#0097A7;color:#fff" data-task="' + task.id + '">' + settings.i18n.edit + '</button></div>',
                            '</fieldset>',
                            '</div>'].join('\n');
            $('#pts-info-box-container').append($content);
        };

        /* Generate the assignation task structure of the info box */
        var generateInfoBoxContentAssignTask = function (taskId) {
            console.warn('CALL FUNCTION: generateInfoBoxContentAssignTask');
            var task = getTaskById(taskId);

            var $content = ['<div class="panel-body">',
                            '<h4 class="pts-check-color text-semibold pts-info-box-title progress-bar-striped pts-close-info-box" style="background-color:' + task.color + '" data-update="true">' + task.name,
                            '<i class="glyphicon glyphicon-remove pull-right"></i></h4>',
                            '<h4><i class="glyphicon glyphicon-chevron-left pull-left pts-info-box-back-btn" data-target="task" data-task="' + task.id + '"></i>' + settings.i18n.assignTaskTitle + '</h4>',
                            '<div class="form-group"><label for="sel42">' + settings.i18n.selectUsersToAssign + ' : </label>',
                            '<select multiple="" class="form-control pts-task-assign-users-list" id="sel42"></select></div>',
                            '<b>' + settings.i18n.from + '</b><div class="input-group date pts-datetimepicker-start" id="pts-task-assign-datepicker-start">',
                            '<input type="text" class="form-control"/>',
                            '<span class="input-group-addon">',
                            '<span class="glyphicon glyphicon-calendar"></span>',
                            '</span></div>',
                            '<b>' + settings.i18n.to + '</b><div class="input-group date pts-datetimepicker-end" id="pts-task-assign-datepicker-end">',
                            '<input type="text" class="form-control"/>',
                            '<span class="input-group-addon">',
                            '<span class="glyphicon glyphicon-calendar"></span>',
                            '</span></div><div id="pts-assign-task-err" style="color:red"></div><br><div class="pull-right">',
                            '<button id="pts-task-assign-btn" class="btn pts-check-color" style="background-color:#00BCD4" data-task="' + taskId + '">' + settings.i18n.assign + '</button></div>',
                            '<br></div>'].join('\n');

            $('#pts-info-box-container').append($content);
            $('#pts-task-assign-datepicker-start').datetimepicker().data('DateTimePicker').locale(settings.locale).widgetPositioning({horizontal: 'left', vertical: 'bottom'}).keepOpen(false);
            $('#pts-task-assign-datepicker-end').datetimepicker().data('DateTimePicker').locale(settings.locale).widgetPositioning({horizontal: 'left', vertical: 'bottom'}).keepOpen(false);

            settings.users.forEach(function (user, i) {
                $('.pts-task-assign-users-list').append('<option class="pts-task-assign-user-option" value="' + i + '" data-user="' + user.name + '">' + user.name + '</option>');
            });

            $.each(task.users, function (i) {
                var user = settings.users[i];
                var $head = ['<hr><div class="pts-info-box-user" data-user="' + user.index + '">',
                            '<h4 class=" text-semibold heading-divided">' + user.name + '</h4>',
                            '<table><tbody class="pts-info-box-user-list" data-head="' + user.index + '"></tbody></table></div>'].join('\n');
                $('#pts-info-box-container > .panel-body').append($head);
                user.tasks.forEach(function (_task, taskIndex) {
                    if (_task.id === task.id) {
                        var $userTasks =    ['<tr><td><i class="glyphicon glyphicon-trash pts-task-assign-delete-user" data-user="' + user.index + '" data-task="' + _task.id + '" data-task-index="' + taskIndex + '"></i>',
                                            '<b>' + settings.i18n.from + '</b> ' + moment(_task.start_date).locale(settings.locale).format('llll'),
                                            ' <b>' + settings.i18n.to + '</b> ' + moment(_task.end_date).locale(settings.locale).format('llll') + '</td></tr>'].join('\n');
                        $('.pts-info-box-user-list[data-head=' + user.index + ']').append($userTasks);
                    }
                });
            });
            getContrastedColor();
        };

        /* Generate the user creation structure of the info box */
        var generateInfoBoxContentCreateUser = function () {
            console.warn('CALL FUNCTION: generateInfoBoxContentCreateUser');

            var $content = ['<div class="panel-body">',
                '<h4 class="text-semibold pts-info-box-title pts-close-info-box pts-check-color" style="background-color:' + settings.defaultColor + '">' + settings.i18n.addNewUser,
                '<i class="glyphicon glyphicon-remove pull-right"></i></h4>',
                '<fieldset>',
                '<div class="form-group"><label>' + settings.i18n.name + ' <small>(' + settings.i18n.required + ')</small> :</label>',
                '<input id="pts-add-user-input-name" type="text" class="form-control" maxlength="40">',
                '<div id="pts-add-user-err-name" style="color:red"></div></div>',
                '<div class="form-group"><label>' + settings.i18n.group + ' :</label>',
                '<input id="pts-add-user-input-group" type="text" class="form-control" maxlength="60" placeholder="' + settings.i18n.createNewGroup + '">',
                '<span>' + settings.i18n.or + '</span><select id="pts-add-user-select-group" type="select" class="form-control" maxlength="60">',
                '<option disabled selected>' + settings.i18n.selectGroup + '</option></select></div>',
                '<div class="btn-group">',
                '<button type="button" class="pts-close-info-box btn btn-danger">' + settings.i18n.cancel + '</button>',
                '<button type="button" class="btn pts-create-user-btn" style="background-color:#00BCD4;color:#fff" data-assign="true">' + settings.i18n.createAndAssign + '</button>',
                '<button type="button" class="btn pts-create-user-btn" style="background-color:#0097A7;color:#fff" data-assign="false">' + settings.i18n.create + '</button></div>',
                '</fieldset>',
                '</div>'].join('\n');
            $('#pts-info-box-container').append($content);
            settings.groups.forEach(function (e) {
                $('#pts-add-user-select-group').append('<option value="' + e + '">' + e + '</option>');
            });
        };

        /* Generate list view main structure */
        var generateListBaseView = function () {
            console.warn('CALL FUNCTION: generateListBaseView');

            if (!settings.list) settings.list = {};
            settings.list.display = 'today';
            var $columnContainer =  ['<button class="btn btn-sm pts-list-range-btn" data-value="all">' + settings.i18n.all + '</button>',
                                    '<button class="btn btn-sm pts-list-range-btn selected" data-value="today">' + settings.i18n.today + '</button>',
                                    '<button class="btn btn-sm pts-list-range-btn" data-value="week">' + settings.i18n.thisWeek + '</button>',
                                    '<button class="btn btn-sm pts-list-range-btn" data-value="month">' + settings.i18n.thisMonth + '</button>',
                                    '<button class="btn btn-sm pts-list-range-btn" data-value="year">' + settings.i18n.thisYear + '</button>',
                                    '<button class="btn btn-sm pts-list-range-btn" data-value="personalized">' + settings.i18n.personalized + '</button>',
                                    '<div class="pts-list-personalized-inputs-container row"></div>'].join('\n');

            var $dropdownMenu =     ['<div class="dropdown" style="top:2px"><button id="addDropdown" class="btn btn-sm pts-btn-add-elem dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                                    '<i class="glyphicon glyphicon-plus"></i></button>',
                                    '<ul class="dropdown-menu" aria-labelledby="addDropdown">',
                                    '<li><a href="#" class="pts-add-new-task">' + settings.i18n.addNewTask + '</a></li>',
                                    '<li><a href="#" class="pts-add-new-user">' + settings.i18n.addNewUser + '</a></li></ul></div>'].join('\n');
            $('.pts-column-title-container > div').append($columnContainer);
            $('.pts-corner-mask').append($dropdownMenu);
            var $headerInputs = ['<input class="pts-list-search-task" placeholder="' + settings.i18n.search + '">',
                '<label class="checkbox-inline text-no-select" style="margin-left:5px;"><input id="pts-list-task-select-all" type="checkbox" checked="checked">' + settings.i18n.selectAll + '</label>'].join('\n');
            $('.pts-line-title-container').append($headerInputs);
            settings.tasks.forEach(function (_task) {
                var $taskLabel =    ['<div class="pts-list-row-task progress-bar-striped pts-check-color" style="background-color:' + _task.color + '">',
                                    '<label class="checkbox-inline"><input class="pts-list-task-enabler-input" type="checkbox" checked="checked" data-task="' + _task.id + '">' + _task.name + '</label></div>'].join('\n');
                $('.pts-line-title-container').append($taskLabel);
            });

            $('.pts-main-content').empty().append('<div class="pts-list-tasks-container row"></div>');
            getContrastedColor();
        };

        /* Generate the date range picker for the list view */
        var generateRangePicker = function () {
            console.log('CALL FUNCTION: generateRangePicker');

            $('.pts-list-range-btn').css('display', 'none');
            var $rangeSelector =    ['<div class="col-sm-5"><span>' + settings.i18n.from + '</span><div class="input-group date pts-datetimepicker-start" id="pts-list-datetimepicker-start">',
                                    '<input type="text" class="form-control"/>',
                                    '<span class="input-group-addon">',
                                    '<span class="glyphicon glyphicon-calendar"></span>',
                                    '</span></div></div>',
                                    '<div class="col-sm-5"><span>' + settings.i18n.to + '</span><div class="input-group date pts-datetimepicker-end" id="pts-list-datetimepicker-end">',
                                    '<input type="text" class="form-control"/>',
                                    '<span class="input-group-addon">',
                                    '<span class="glyphicon glyphicon-calendar"></span>',
                                    '</span></div></div>',
                                    '<div class="col-sm-2"><button class="btn pts-list-range-submit btn-icon"><i class="glyphicon glyphicon-ok"></i></button>',
                                    '<button class="btn pts-list-range-dismiss btn-danger btn-icon"><i class="glyphicon glyphicon-remove"></i></button></div>'].join('\n');
            $('.pts-list-personalized-inputs-container').append($rangeSelector);
            $('#pts-list-datetimepicker-start').datetimepicker().data('DateTimePicker').locale(settings.locale);
            $('#pts-list-datetimepicker-end').datetimepicker().data('DateTimePicker').locale(settings.locale);
        };

        /* Generate a task box in the list view */
        var generateListTaskContent = function (task) {
            console.log('CALL FUNCTION: generateListTaskContent');

            var totalCycle = 0,
                thisCycle = 0,
                totalUsers = 0,
                thisUsers = 0;

            var $container =    ['<div class="col-lg-12 pts-list-task-container" data-task="' + task.id + '">',
                                '<div class="panel panel-primary" style="border-color:' + task.color + '">',
                                '<div class="panel-heading progress-bar-striped pts-check-color pts-list-task-header" style="background-color:' + task.color + ';border-color:' + task.color + '"',
                                'data-task="' + task.id + '">',
                                '<h6 class="panel-title">' + task.name + '</h6>',
                                '<a class="heading-elements-toggle"><i class="icon-menu"></i></a></div>',
                                '<div class="panel-body">' + (task.description ? task.description : '') + '</div>',
                                '<div class="panel-body"><div class="table-responsive">',
                                '<table class="table table-bordered"><tbody class="pts-list-date-list" data-task="' + task.id + '"></tbody></table>',
                                '</div></div><div class="panel-footer pts-list-task-footer"></div></div></div>'].join('\n');
            $('.pts-list-tasks-container').append($container);

            $.each(task.users, function (i, user) {
                totalCycle += user.length;
                totalUsers++;
                var $elem = $(document.createElement('tr'));
                $elem.append('<td class="pts-list-user-name" data-user="' + i + '">' + settings.users[i].name + '</td><td class="pts-dt-list"></td>');
                var isInCycle = false;
                user.forEach(function (iTask) {
                    if (isDateInDate(settings.list, settings.users[i].tasks[iTask]) || settings.list.display === 'all') {
                        $elem.children('.pts-dt-list').append('- <b>' + settings.i18n.from + '</b> ' + moment(settings.users[i].tasks[iTask].start_date).locale(settings.locale).format('lll') +
                            '<b> ' + settings.i18n.to + '</b> ' + moment(settings.users[i].tasks[iTask].end_date).locale(settings.locale).format('lll') + '<br>');
                        if (isInCycle == false) thisUsers++;
                        isInCycle = true;
                        thisCycle++;
                    }
                });
                if (isInCycle) {
                    $('.pts-list-date-list[data-task=' + task.id + ']').append($elem);
                }
            });
            if (thisUsers === 0 || thisCycle === 0) {
                $('.pts-list-task-container[data-task=' + task.id + ']').remove();
            }

            var $footer =   ['<p><b>' + totalUsers + '</b> ' + settings.i18n.usersWhose + ' <b>' + thisUsers + '</b> ' + settings.i18n.inSelectedPeriod + '</p>',
                            '<p><b>' + totalCycle + '</b> ' + settings.i18n.cycleWhose + ' <b>' + thisCycle + '</b> ' + settings.i18n.inSelectedPeriod + '</p>'].join('\n');
            $('.pts-list-task-container[data-task=' + task.id + '] .pts-list-task-footer').append($footer);

            getContrastedColor();
        };

        /* Generate a notification */
        var generateNotification = function (origin, message) {
            console.warn('CALL FUNCTION: generateNotification');

            if (settings.disableNotifications) return;
            var uniqueId = generateRandomId();
            var $notification = ['<div class="alert alert-' + origin + ' alert-dismissible" role="alert" data-id="' + uniqueId + '">',
                                '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
                                message +  '</div>'].join('\n');
            $('#pts-notification-container').append($notification);
            setTimeout(function(){
                $('.alert[data-id=' + uniqueId + ']').remove();
            },settings.notificationDuration);
        };

        /********* Initialization *********/
        console.group();
        console.info("Initialization");

        getUsersTasksInTasks();
        generateHeader();
        updateDisplay(settings.currentDisplay);

        console.groupEnd();

        /********* Events *********/

        $('.pts-btn-day-view').click( function () {
            updateDisplay('days');
        });

        $('.pts-btn-month-view').click( function () {
            updateDisplay('months');
        });

        $('.pts-btn-list-view').click( function () {
            updateDisplay('list');
        });

        $('.pts-btn-next').click(function () {
            $('.pts-scheduler-container').scrollTop(0);
            goForward();
            generateTableLines();
            generateGroupMainContent();
            generateUsersList();
        });

        $('.pts-btn-previous').click(function () {
            $('.pts-scheduler-container').scrollTop(0);
            goBackward();
            generateTableLines();
            generateGroupMainContent();
            generateUsersList();
        });

        $('#header-datetimepicker').on('dp.change', function (e) {
            if (e.date === settings.date.selected) return;
            settings.date.selected = e.date;
            updateDisplay(settings.currentDisplay);
            generateTableLines();
            generateGroupMainContent();
            generateUsersList();
        });

        $('.pts-scheduler-container').scroll(function () {
            $('.pts-line-title-container div').scrollTop($(this).scrollTop());
            $('.pts-column-title-container ').scrollLeft($(this).scrollLeft());
            setTaskLabelPosition();
        });

        $('#pit-scheduler').on('click', '.close-group-panel', function () {
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

        $('#pit-scheduler').on('change', '#hide-user-btn', function () {
            settings.hideEmptyLines = $(this).is(':checked');
            generateTableLines();
            generateGroupMainContent();
            generateUsersList();
        });

        $('#pit-scheduler').on('change', '#disable-labels-mov', function () {
            settings.disableLabelsMovement = $(this).is(':checked');
            generateTableLines();
            generateGroupMainContent();
            generateUsersList();
        });

        $('#pit-scheduler').on('click', '.pts-column-element[data-date]', function () {
            settings.date.selected = moment($(this).attr('data-date'));
            updateDisplay('days');
            generateTableLines();
            generateGroupMainContent();
        });

        $('#pit-scheduler').on('click', '.pts-line-marker[data-task], .pts-list-task-header[data-task]', function () {
            openInfoBox($(this).attr('data-task'), null, 'task');
        });

        $('#pit-scheduler').on('click', '.pts-close-info-box', function () {
            if ($(this).data('update') == true) {
                updateDisplay(settings.currentDisplay);
            } else {
                closeInfoBox();
            }
        });

        $('#pit-scheduler').on('click', ' .pts-group-user[data-user]', function () {
            openInfoBox(null, $(this).data('user'), 'user');
        });

        $('#pit-scheduler').on('click', '.pts-info-box-task-header[data-task][data-user]', function () {
            openInfoBox($(this).data('task'), $(this).data('user'), 'task');
        });

        $('#pit-scheduler').on('click', '#pts-list-task-select-all', function () {
            $('.pts-list-task-enabler-input').prop('checked', $(this).context.checked);
            switchListRange(settings.list.display);
        });

        $('#pit-scheduler').on('click', '.pts-list-task-enabler-input',  function () {
            var checked = true;
            $('.pts-list-task-enabler-input').each(function () {
                if ($(this).prop('checked') == false) {
                    checked = false;
                }
            });
            if (checked == false) {
                $('#pts-list-task-select-all').prop('checked', false);
            } else  {
                $('#pts-list-task-select-all').prop('checked', true);
            }
            switchListRange(settings.list.display);
        });

        $('#pit-scheduler').on('click', '.pts-list-range-btn[data-value]', function () {
            var range = $(this).data('value');
            settings.list.display = range;
            $('.pts-list-personalized-inputs-container').empty();
            $('.pts-list-range-btn').removeClass('selected');
            $(this).addClass('selected');
            if (range !== 'personalized') {
                switchListRange(range);
            } else {
                generateRangePicker();
            }
        });

        $('#pit-scheduler').on('dp.change', '.pts-datetimepicker-start', function (e) {
            $('.pts-datetimepicker-end').data('DateTimePicker').minDate(e.date).date(e.date).viewDate(e.date);
        });

        $('#pit-scheduler').on('dp.change', '.pts-datetimepicker-start, .pts-datetimepicker-end', function (e) {
            $('.pts-datetimepicker-end').data('DateTimePicker').hide();
            $('.pts-datetimepicker-start').data('DateTimePicker').hide();
        });

        $('#pit-scheduler').on('click', '.pts-list-range-submit', function () {
            settings.list.start_date = $('#pts-list-datetimepicker-start').data('DateTimePicker').date();
            settings.list.end_date = $('#pts-list-datetimepicker-end').data('DateTimePicker').date();
            $('.pts-list-personalized-inputs-container').empty();
            $('.pts-list-range-btn').css('display', 'block');
            if (!settings.list.start_date || ! settings.list.end_date) return $('.pts-list-range-btn').removeClass('selected');
            switchListRange('personalized');
        });

        $('#pit-scheduler').on('click', '.pts-list-range-dismiss', function () {
            $('.pts-list-personalized-inputs-container').empty();
            $('.pts-list-range-btn').css('display', 'block');
            $('.pts-list-range-btn').removeClass('selected');
        });

        $('#pit-scheduler').on('click', '.pts-list-user-name[data-user]', function () {
            openInfoBox(null, $(this).data('user'), 'user');
        });

        $('#pit-scheduler').on('keyup', '.pts-list-search-task', function () {
            var searchString = $(this).val().toLowerCase();
            $('.pts-list-row-task').each(function () {
                if ($(this).children('label').text().toLowerCase().indexOf(searchString) >= 0) {
                    $(this).css('display', 'block');
                } else {
                    $(this).css('display', 'none');
                }
            });
        });

        $('#pit-scheduler').on('click', '.pts-add-new-task', function () {
            openInfoBox(null, null, "createTask");
        });

        $('#pit-scheduler').on('click', '.pts-add-new-user', function () {
            openInfoBox(null, null, "createUser");
        });

        $('#pit-scheduler').on('click', '.pts-create-task-btn', function () {
            var name = $('#pts-add-task-input-name').val(),
                id = $('#pts-add-task-input-id').val(),
                description = $('#pts-add-task-input-description').val(),
                color = $('#pts-add-task-input-color').val();
            $('#pts-add-task-err-name').html('');
            $('#pts-add-task-err-id').html('');
            $.each(settings.tasks, function (i, e) {
                if (e.name == name) {
                    $('#pts-add-task-err-name').html(settings.i18n.nameAlreadyTaken);
                    name = '';
                }
                if (e.id == id) {
                    $('#pts-add-task-err-id').html(settings.i18n.idAlreadyTaken);
                    name = '';
                }
            });
            if (name.length < 1) return;
            closeInfoBox();
            createNewTask(name, id, description, color, $(this).data('assign'));
        });

        $('#pit-scheduler').on('click', '.pts-create-user-btn', function () {
            var name = $('#pts-add-user-input-name').val(),
                group = $('#pts-add-user-input-group').val();
            $('#pts-add-user-err-name').html('');
            if (name.length < 1) return $('#pts-add-user-err-name').html(settings.i18n.requiredField);
            closeInfoBox();
            createNewUser(name, group, $(this).data('assign'));
        });

        $('#pit-scheduler').on('click', '.pts-delete-task-btn[data-task]', function () {
            if ($(this).attr('data-confirm') && $(this).attr('data-confirm') == 'false') {
                $(this).text(settings.i18n.confirm);
                $(this).attr('data-confirm', true);
                return;
            }
            removeTask($(this).data('task'));
        });

        $('#pit-scheduler').on('click', '.pts-assign-task-btn', function () {
            openInfoBox($(this).data('task'), null, 'assignTask');
        });

        $('#pit-scheduler').on('click', '#pts-task-assign-btn[data-task]', function () {
            var start_date = $('.pts-datetimepicker-start').data('DateTimePicker').date(),
                end_date = $('.pts-datetimepicker-end').data('DateTimePicker').date(),
                users = $('.pts-task-assign-users-list').val(),
                task = getTaskById($(this).data('task'));
            if (users && start_date && end_date) {
                assignUsersToTask(users, task, start_date, end_date);
            } else {
                $('#pts-assign-task-err').text(settings.i18n.allInputRequired);
            }
        });

        $('#pit-scheduler').on('click', '.pts-main-group-user, .pts-scheduler-container', function (e) {
            if (e.target !== this)
                return;
            if ($('.pts-close-info-box').data('update') == true) {
                updateDisplay(settings.currentDisplay);
            } else {
                closeInfoBox();
            }
        });

        $('#pit-scheduler').on('click', '.pts-task-assign-delete-user[data-user][data-task][data-task-index]', function () {
            var userIndex = $(this).data('user'),
                task = getTaskById($(this).data('task')),
                taskIndex = $(this).data('task-index');

            if (settings.users[userIndex].tasks[taskIndex].id == task.id) {
                deleteTaskFromUser(settings.users[userIndex], task, taskIndex);
                $(this).parent('td').remove();
            }

        });

        $('#pit-scheduler').on('click', '.pts-edit-task-btn[data-task]', function () {
            openInfoBox($(this).data('task'), null, 'editTask');
        });

        $('#pit-scheduler').on('click', '.pts-edit-task-confirm-btn[data-task]', function () {
            var task = getTaskById($(this).data('task')),
                newData = {};

            newData.name = $('#pts-edit-task-input-name').val();
            newData.color = $('#pts-edit-task-input-color').val();
            newData.description = $('#pts-edit-task-input-description').val();
            editTask(task, newData);
        });

        $('#pit-scheduler').on('click', '.pts-info-box-back-btn[data-target]', function () {
            openInfoBox($(this).data('task'), $(this).data('user'), $(this).data('target'));
        });

        $('#pit-scheduler').on('change', '#pts-add-user-select-group', function () {
            $('#pts-add-user-input-group').val($(this).val());
        });
        
        return $scheduler;
    };
}(jQuery));
