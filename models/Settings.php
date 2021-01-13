<?php

namespace OctoberFa\Calendars\Models;

use Model;

class Settings extends Model
{
    public $implement = ['System.Behaviors.SettingsModel'];

    // A unique code
    public $settingsCode = 'octoberfa_calendars';

    // Reference to field configuration
    public $settingsFields = 'fields.yaml';
}
