<?php

namespace OctoberFa\Calendars;

use Event;
use Config;
use Backend;
use OctoberFa\Calendars\Models\Settings;
use Request;
use System\Classes\PluginBase;

/**
 * Calendars Plugin Information File
 */
class Plugin extends PluginBase
{
    /**
     * Returns information about this plugin.
     *
     * @return array
     */
    public function pluginDetails()
    {
        return [
            'name'        => 'octoberfa.calendars::lang.plugin.name',
            'description' => 'octoberfa.calendars::lang.plugin.description',
            'author'      => 'OctoberFa',
            'icon'        => 'icon-calendar'
        ];
    }

    /**
     * Register method, called when the plugin is first registered.
     *
     * @return void
     */
    public function register()
    {
        // Listen for `backend.page.beforeDisplay` event.
        Event::listen('backend.page.beforeDisplay', function ($controller, $action, $params) {
            if (!Request::ajax()) {
                $controller->addJs(Config::get('cms.pluginsPath') . ('/octoberfa/calendars/assets/js/octoberfa.datetime.min.js'));
                $controller->addJs(Config::get('cms.pluginsPath') . ('/octoberfa/calendars/assets/js/octoberfa.datepicker.min.js'));
                $controller->addCss(Config::get('cms.pluginsPath') . ('/octoberfa/calendars/assets/css/octoberfa.datepicker.min.css'));
            }
        });
        Event::listen('backend.layout.extendHead', function ($controller, $layout) {
            $language =
                Event::fire('octoberfa.calendars.getBackendCalendarLanguage', [], true);
            $type =
                Event::fire('octoberfa.calendars.getBackendCalendarType', [], true);
            if (!$language) {
                $language = Settings::get('calendars_language', 'en');
            }
            if (!$type) {
                $type = Settings::get('calendars_type', 'gregorian');
            }

            return '<meta name="backend-calendar-type" content="' . $type . '"><meta name="backend-calendar-language" content="' . $language . '">';
        });
    }

    /**
     * Registers any back-end permissions used by this plugin.
     *
     * @return array
     */
    public function registerPermissions()
    {
        return [
            'octoberfa.calendars.change_settings' => [
                'tab' => 'octoberfa.calendars::lang.permissions.tab',
                'label' => 'octoberfa.calendars::lang.permissions.label'
            ],
        ];
    }


    public function registerSettings()
    {
        return [
            'calendars' => [
                'label'       => 'octoberfa.calendars::lang.setting.menu',
                'description' => 'octoberfa.calendars::lang.setting.description',
                'category'    => 'OctoberFa',
                'icon'        => 'icon-calendar',
                'class'       => 'OctoberFa\Calendars\Models\Settings',
                // 'order'       => 500,
                'context'     => 'system',
                'keywords'    => 'octoberfa calendars',
                'permissions' => ['octoberfa.calendars.change_settings']
            ]
        ];
    }
}
