# jQuery pit-scheduler
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/payintech/jquery-easy-search-ui/master/LICENSE)

![Alt text](https://cloud.githubusercontent.com/assets/15311764/19238902/ed00a51a-8f03-11e6-90a4-911fb4808961.PNG)
![Alt text](https://cloud.githubusercontent.com/assets/15311764/19239386/174ea1c6-8f06-11e6-9051-b6ba43d7247d.PNG)
Pit-scheduler is a jQuery plugin that lets you manage tasks through a complete interface. It has been developed to be used for permissions management but is compatible with both usages.

In all the following examples it is used as a permission manager for a hostel.
*****

## Usage


#### 1) Include the plugin's files to your project

First, include that two files:
```html
<link rel="stylesheet/less" type="text/css" href="../__assets__/pit-scheduler.css"/>
<script src="../__assets__/pit-scheduler.js"></script>
```

#### 2) Include the dependencies

Required files:

    - jquery.js (>= 2.2.4)
    - moment.js (prefere moment-with-locales.js)
    - bootstrap.js (>= 3.3.7)
    - bootstrap.css
    - bootstrap-datetimepicker.js (>= 4.17)
    - bootstrap.datetimepicker.css

#### 3) Insert the scheduler using the 'pit-scheduler' id

```html
<div id="pit-scheduler"></div>
```

#### 4) Configure your scheduler using Javascript

```javascript
    $(document).ready(function () {
        $("#pit-scheduler").pitScheduler({
            locale: 'fr',
            defaultDisplay: 'months',
            hideEmptyLines: false,
            disableLabelsMovement: false,
            defaultGroupName: 'Default group',
            defaultDate: '2016-09-26 16:30',
            defaultColor: '#00bdd6',
            tasks:  [
                {
                    id: 'djJ3d7sjk928S0',
                    name: 'Accès Jacuzzi',
                    description: 'Permet d\'accéder au Jacuzzi et de provoquer de la jalousie',
                    color: '#fcd720'
                },
                {
                    id: 'fJD67Bd4jh7',
                    name: 'Accès Piscine et SPA',
                    color: '#E91E63'
                }
            ],
            users: [
                   {
                    name: 'Ai WeiWei',
                    group: 'Group A',
                    tasks: [
                        {
                            id: 'djJ3d7sjk928S0',
                            start_date: '2015-09-26 03:00',
                            end_date: '2016-09-26 16:30'
                        },
                        {
                            id: 'djJ3d7sjk928S0',
                            start_date: '2016-09-28 6:00',
                            end_date: '2017-09-28 18:30'
                        },
                        {
                            id: 'fJD67Bd4jh7',
                            start_date: '2016-09-08 10:40',
                            end_date: '2016-09-21 16:00'
                        },
                        {
                            id: 'fJD67Bd4jh7',
                            start_date: '2016-09-23 10:10',
                            end_date: '2016-09-29 16:50'
                        }
                    ]
                },
                {
                    name: 'Michel Petrucciani',
                    group: 'Group B',
                    tasks: [
                        {
                            id: 'djJ3d7sjk928S0',
                            start_date: '2016-09-01 06:00',
                            end_date: '2016-09-04 09:00'
                        },
                        {
                            id: 'djJ3d7sjk928S0',
                            start_date: '2016-09-04 11:00',
                            end_date: '2016-09-05 18:00'
                        }
                    ]
                }
            ]
        });
    });

```

As you can see, the tasks (or permissions) list is declared depending on the users list.

Take a look at this table to get informations about each field:

| Name          | Values| default  | Description  |
| ------------- |-------|---------|---------------|
|locale|(String) en&#124;fr|en| Define the locale to use. Actually, only english and french are fully supported but you can easily add new translations by editing the main Js file!|
|defaultDisplay|(String) days&#124;months&#124;list|months| This let you define which tab must be displayed by default|
|hideEmptyLines|(Bool) true&#124;false|true|Hide lines with no tasks|
|disableLabelsMovement|(Bool) true&#124;false|false| Disable the tasks label movement|
|defaultGroupName| (String)What you want|It depends on the locale| Define a default group name for users with no group|
|defaultDate|(Date)What you want|The current day| Define which date the scheduler must use by default|
|defaultColor|HEX, RGB, HSL color|#00bdd6| Define the color that must be used for tasks which have no defined color|

For the tasks:

| Name          | Values | Description  |
| ------------- |--------|--------------|
|id (required) | (String) | Define a unique id that will be used to make the link with the users tasks|
|name (required) | (String) | The name of the task (prefere short keywords)|
|description | (Long string)| You can add an optionnal description on each task|
|color|HEX, RGB, HSL color| Add a splendid color to your tasks. Notice that the label text color will change depending on the brightness of your color, magic!|

And finally, the users:

| Name          | Values | Description  |
| ------------- |--------|--------------|
|name (required) | (String) | The user name|
|group | (String) | The group the user belongs to. Note that it will create a new tab for each new group|
|tasks | (Array of objects)|The task which the user is assigned to. Each one must include the task id and a start_date and end_date. (see the example)|

#### 5) Enjoy!

You are done with configuration, your scheduler is now ready to be used! Note that if you are using IE < 10, there are some chances that it does not work as expected. The solution? Use another browser?

### How it works

I have tried to implement a lot of great features on this project, the best way to explore all of them is probably to click everywhere!
No, seriously, I'm serious. But if you do not have time for that, here is a small list of some features that you may appreciate:

- On the months view, click on a day to switch to the days view
- You can click on a task or on a user to get more information about it
- You can close a group tab by clicking the small 'remove' button on the left
- The options' menu lets you access to some parameters
- By Default, when you are scrolling horizontally on the scheduler, the tasks labels will move to stay on the window
- if you guess to use it with a lot of users and tasks, it will crash or be very slow (yeah I know, it needs some refactoring, I'm working on it).

## Demo

You'll find a demo in the ___demo___ folder. It shows you how to include the scheduler to your project and how to use it.

## TODOS

* Make the scheduler working with Ajax
* Add new language support
* Code refactoring (a lot)
* Smooth the right panel movement
* Why not adding a button to create new tasks? (I'll take the time to do it in a new release)

If you see any good feature that may be added to this project, leave a message! You can also send me a merge request :)

## Notes and contributing

I have developed this project during a traineeship. This is also my first real big project using jQuery. I've tried to do the best and I'll be happy to get your suggestions.

Love it? Star it!  :)



##knows issues
* The users tab is moving alone on scroll (no solution find for the moment)
* Small performance hit when using it with more than 10 users or a lot of tasks
* Not working on small screens (how can it be?)

## License

Feel free to do what you wan't with this project!

This plugin is available under the MIT license.


