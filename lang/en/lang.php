<?php

return [
    'plugin' => [
        'name' => 'OctoberFa Calendars',
        'description' => 'Change backend datepicker calendar type',
    ],
    'setting' => [
        'menu' => 'Calendars',
        'description' => 'Manage OctoberFa Calendar Settings.',
        'category' => 'OctoberFa',
        'calendar_type' => 'Calendar Type',
        'calendar_language' => 'Calendar Language'
    ],
    'permissions' => [
        'tab' => 'OctoberFa',
        'label' => 'Change Calendar Settings'
    ]
];
