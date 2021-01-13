// @koala-prepend "vendor/luxon.js"
// @koala-prepend "luxonMomentFormat.js"

+(function ($, LuxonMomentFormat) {
    "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype;

    var DateTimeConverter = function (element, options) {
        this.$el = $(element);
        this.options = options || {};

        $.oc.foundation.controlUtils.markDisposable(element);
        Base.call(this);
        this.init();
    };

    DateTimeConverter.prototype = Object.create(BaseProto);
    DateTimeConverter.prototype.constructor = DateTimeConverter;

    DateTimeConverter.prototype.init = function () {
        this.initDefaults();

        this.$el.text(this.getDateTimeValue());

        this.$el.one("dispose-control", this.proxy(this.dispose));
    };

    DateTimeConverter.prototype.initDefaults = function () {
        if (!this.options.timezone) {
            this.options.timezone = $('meta[name="backend-timezone"]').attr(
                "content"
            );
        }

        if (!this.options.locale) {
            this.options.locale = $(
                'meta[name="backend-calendar-language"]'
            ).attr("content");
        }
        if (!this.options.calendarType) {
            this.options.calendarType = $(
                'meta[name="backend-calendar-type"]'
            ).attr("content");
        }
        this.options.calendarType = this.options.calendarType
            .replace("ummalqura", "islamic-umalqura")
            .replace("gregorian", "gregory")
            .replace("thai", "buddhist")
            .replace("ethiopian", "ethiopic")
            .replace("taiwan", "roc");

        if (!this.options.format) {
            this.options.format = "llll";
        }

        if (this.options.formatAlias) {
            this.options.format = this.getFormatFromAlias(
                this.options.formatAlias
            );
        }

        this.appTimezone = $('meta[name="app-timezone"]').attr("content");
        if (!this.appTimezone) {
            this.appTimezone = "UTC";
        }
    };

    DateTimeConverter.prototype.getDateTimeValue = function () {
        this.datetime = this.$el.attr("datetime");

        if (this.$el.get(0).hasAttribute("data-ignore-timezone")) {
            this.appTimezone = "UTC";
            this.options.timezone = "UTC";
        }

        var dateObj = luxon.DateTime.fromISO(
                moment(this.datetime).toISOString(),
                {
                    zone: this.appTimezone,
                }
            ),
            result;
        if (this.options.locale) {
            dateObj = dateObj.setLocale(this.options.locale).reconfigure({
                locale: this.options.locale,
                numberingSystem: "latn",
                outputCalendar: this.options.calendarType,
            });
        }

        if (this.options.timezone) {
            dateObj = dateObj.setZone(this.options.timezone);
        }

        if (this.options.timeSince) {
            result = dateObj.toRelative();
        } else if (this.options.timeTense) {
            result = dateObj.toRelativeCalendar();
        } else {
            result = LuxonMomentFormat(dateObj, this.options.format);
        }

        return result;
    };

    DateTimeConverter.prototype.getFormatFromAlias = function (alias) {
        var map = {
            time: "LT",
            timeLong: "LTS",
            date: "L",
            dateMin: "l",
            dateLong: "LL",
            dateLongMin: "ll",
            dateTime: "LLL",
            dateTimeMin: "lll",
            dateTimeLong: "LLLL",
            dateTimeLongMin: "llll",
        };

        return map[alias] ? map[alias] : "llll";
    };

    DateTimeConverter.prototype.dispose = function () {
        this.$el.off("dispose-control", this.proxy(this.dispose));
        this.$el.removeData("oc.dateTimeConverter");

        this.$el = null;
        this.options = null;

        BaseProto.dispose.call(this);
    };

    DateTimeConverter.DEFAULTS = {
        format: null,
        formatAlias: null,
        timezone: null,
        locale: null,
        timeTense: false,
        timeSince: false,
    };

    // PLUGIN DEFINITION
    // ============================

    var old = $.fn.dateTimeConverter;

    $.fn.dateTimeConverter = function (option) {
        var args = Array.prototype.slice.call(arguments, 1),
            items,
            result;

        items = this.each(function () {
            var $this = $(this);
            var data = $this.data("oc.dateTimeConverter");
            var options = $.extend(
                {},
                DateTimeConverter.DEFAULTS,
                $this.data(),
                typeof option == "object" && option
            );
            if (!data)
                $this.data(
                    "oc.dateTimeConverter",
                    (data = new DateTimeConverter(this, options))
                );
            if (typeof option == "string")
                result = data[option].apply(data, args);
            if (typeof result != "undefined") return false;
        });

        return result ? result : items;
    };

    $.fn.dateTimeConverter.Constructor = DateTimeConverter;

    $.fn.dateTimeConverter.noConflict = function () {
        $.fn.dateTimeConverter = old;
        return this;
    };

    $(document).render(function () {
        $("time[data-datetime-control]").dateTimeConverter();
    });
})(window.jQuery, window.LuxonMomentFormat);
