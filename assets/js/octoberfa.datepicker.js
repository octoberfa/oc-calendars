/*
 * DatePicker plugin
 */
// @koala-prepend "momentFormatToCalendars.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.plugin.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.all.min.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.coptic.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.discworld.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.ethiopian.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.ethiopian-am.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.hebrew.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.hebrew-he.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.islamic.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.islamic-ar.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.islamic-fa.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.persian.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.persian-fa.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.taiwan.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.taiwan-zh-TW.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.thai.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.thai-th.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.ummalqura.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.ummalqura-ar.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.ummalqura-ar.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.picker.min.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.lang.js"
// @koala-prepend "vendor/jquery-calendars/js/jquery.calendars.picker.lang.js"

+(function ($) {
  "use strict";
  var Base = $.oc.foundation.base,
    BaseProto = Base.prototype;

  var DatePicker = function (element, options) {
    this.$el = $(element);
    this.options = options || {};

    $.oc.foundation.controlUtils.markDisposable(element);
    Base.call(this);
    this.init();
  };

  DatePicker.prototype = Object.create(BaseProto);
  DatePicker.prototype.constructor = DatePicker;

  DatePicker.prototype.init = function () {
    var self = this,
      $form = this.$el.closest("form"),
      changeMonitor = $form.data("oc.changeMonitor");

    if (changeMonitor !== undefined) {
      changeMonitor.pause();
    }

    this.dbDateTimeFormat = "YYYY-MM-DD HH:mm:ss";
    this.dbDateFormat = "YYYY-MM-DD";
    this.dbTimeFormat = "HH:mm:ss";

    this.$dataLocker = $("[data-datetime-value]", this.$el);
    this.$datePicker = $("[data-datepicker]", this.$el);
    this.$timePicker = $("[data-timepicker]", this.$el);
    this.hasDate = !!this.$datePicker.length;
    this.hasTime = !!this.$timePicker.length;
    this.ignoreTimezone = this.$el.get(0).hasAttribute("data-ignore-timezone");
    if (Array.isArray(this.options.yearRange)) {
      this.options.yearRange = this.options.yearRange.join(":");
    } else if (parseInt(this.options.yearRange)) {
      this.options.yearRange =
        "c-" + this.options.yearRange + ":c+" + this.options.yearRange;
    }

    this.initRegion();

    if (this.hasDate) {
      this.initDatePicker();
    }

    if (this.hasTime) {
      this.initTimePicker();
    }

    if (changeMonitor !== undefined) {
      changeMonitor.resume();
    }

    this.$timePicker.on("change.oc.datepicker", function () {
      if (!$.trim($(this).val())) {
        self.emptyValues();
      } else {
        self.onSelectTimePicker();
      }
    });

    this.$datePicker.on("change.oc.datepicker", function () {
      if (!$.trim($(this).val())) {
        self.emptyValues();
      }
    });

    this.$el.one("dispose-control", this.proxy(this.dispose));
  };

  DatePicker.prototype.dispose = function () {
    this.$timePicker.off("change.oc.datepicker");
    this.$datePicker.off("change.oc.datepicker");
    this.$el.off("dispose-control", this.proxy(this.dispose));
    this.$el.removeData("oc.datePicker");

    this.$el = null;
    this.options = null;

    BaseProto.dispose.call(this);
  };

  //
  // Datepicker
  //

  DatePicker.prototype.initDatePicker = function () {
    var self = this,
      dateFormat = this.getDateFormat(),
      now = moment().tz(this.timezone).format(dateFormat);

    var pickerOptions = {
      yearRange: this.options.yearRange,
      firstDay: this.options.firstDay,
      dateFormat: MomentFormatToCalendars(dateFormat),
      // defaultDate: now,
      onSelect: function (dates) {
        self.onSelectDatePicker.call(self, moment(dates[0].toJSDate()));
      },
    };
    if (this.options.showWeekNumber) {
      pickerOptions.renderer = $.calendarsPicker.weekOfYearRenderer;
    }

    pickerOptions = $.extend(
      pickerOptions,
      {
        calendar: $.calendars.instance(this.calendarType, this.calendarLang),
      },
      $.calendarsPicker.regionalOptions[this.calendarLang]
    );
    var calendar = $.calendars
      .instance(this.calendarType, this.calendarLang)
      .fromJSDate(moment(this.$dataLocker.val()).toDate());

    this.$datePicker.val(
      calendar.formatDate(MomentFormatToCalendars(dateFormat))
    );

    if (this.options.minDate) {
      var minDate = new Date(this.options.minDate);
      pickerOptions.minDate = $.calendars.newDate(
        minDate.getFullYear(),
        minDate.getMonth() + 1,
        minDate.getDate()
      );
    }

    if (this.options.maxDate) {
      var maxDate = new Date(this.options.maxDate);
      pickerOptions.maxDate = $.calendars.newDate(
        maxDate.getFullYear(),
        maxDate.getMonth() + 1,
        maxDate.getDate()
      );
    }

    this.$datePicker.calendarsPicker(pickerOptions);
  };

  DatePicker.prototype.onSelectDatePicker = function (pickerMoment) {
    var pickerValue = pickerMoment.format(this.dbDateFormat);

    var timeValue =
      this.options.mode === "date" ? "00:00:00" : this.getTimePickerValue();

    var momentObj = moment
      .tz(pickerValue + " " + timeValue, this.dbDateTimeFormat, this.timezone)
      .tz(this.appTimezone);

    var lockerValue = momentObj.locale("en").format(this.dbDateTimeFormat);

    this.$dataLocker.val(lockerValue);
  };

  // Returns in user preference timezone
  DatePicker.prototype.getDatePickerValue = function () {
    var value = this.$datePicker.val();

    if (!this.hasDate || !value) {
      return moment
        .tz(this.appTimezone)
        .tz(this.timezone)
        .format(this.dbDateFormat);
    }

    return moment(value, this.getDateFormat()).format(this.dbDateFormat);
  };

  DatePicker.prototype.getDateFormat = function () {
    var format = "YYYY-MM-DD";

    if (this.options.format) {
      format = this.options.format;
    } else if (this.locale) {
      format = moment().locale(this.locale).localeData().longDateFormat("l");
    }

    return format;
  };

  //
  // Timepicker
  //

  DatePicker.prototype.initTimePicker = function () {
    this.$timePicker.clockpicker({
      autoclose: "true",
      placement: "auto",
      align: "right",
      twelvehour: this.isTimeTwelveHour(),
      afterDone: this.proxy(this.onChangeTimePicker),
    });

    this.$timePicker.val(this.getDataLockerValue(this.getTimeFormat()));
  };

  DatePicker.prototype.onSelectTimePicker = function () {
    var pickerValue = this.$timePicker.val();

    var timeValue = moment(pickerValue, this.getTimeFormat()).format(
      this.dbTimeFormat
    );

    var dateValue = this.getDatePickerValue();

    var momentObj = moment
      .tz(dateValue + " " + timeValue, this.dbDateTimeFormat, this.timezone)
      .tz(this.appTimezone);

    var lockerValue = momentObj.format(this.dbDateTimeFormat);

    this.$dataLocker.val(lockerValue);
  };

  DatePicker.prototype.onChangeTimePicker = function () {
    // Trigger a change event when the time is changed, to allow dependent fields to refresh
    this.$timePicker.trigger("change");
  };

  // Returns in user preference timezone
  DatePicker.prototype.getTimePickerValue = function () {
    var value = this.$timePicker.val();

    if (!this.hasTime || !value) {
      return moment
        .tz(this.appTimezone)
        .tz(this.timezone)
        .format(this.dbTimeFormat);
    }

    return moment(value, this.getTimeFormat()).format(this.dbTimeFormat);
  };

  DatePicker.prototype.getTimeFormat = function () {
    return this.isTimeTwelveHour() ? "hh:mm A" : "HH:mm";
  };

  DatePicker.prototype.isTimeTwelveHour = function () {
    return false;
  };

  //
  // Utilities
  //

  DatePicker.prototype.emptyValues = function () {
    this.$dataLocker.val("");
    this.$datePicker.val("");
    this.$timePicker.val("");
  };

  DatePicker.prototype.getDataLockerValue = function (format) {
    var value = this.$dataLocker.val();

    return value ? this.getMomentLoadValue(value, format) : null;
  };

  DatePicker.prototype.getMomentLoadValue = function (value, format) {
    var momentObj = moment.tz(value, this.appTimezone);
    momentObj = momentObj.locale("en");
    momentObj = momentObj.tz(this.timezone);

    return momentObj.format(format);
  };

  DatePicker.prototype.initRegion = function () {
    this.locale = $('meta[name="backend-locale"]').attr("content");
    this.timezone = $('meta[name="backend-timezone"]').attr("content");
    this.appTimezone = $('meta[name="app-timezone"]').attr("content");
    this.calendarType = $('meta[name="backend-calendar-type"]').attr("content");
    this.calendarLang = $('meta[name="backend-calendar-language"]').attr(
      "content"
    );
    if (this.locale === "en") {
      this.locale = "en-UK";
    }
    if (!this.calendarType) {
      this.calendarType = "gregorian";
    }

    if (!this.calendarLang && $.calendarsPicker.regionalOptions[this.locale]) {
      this.calendarLang = this.locale;
    }

    if (!this.appTimezone) {
      this.appTimezone = "UTC";
    }

    if (!this.timezone) {
      this.timezone = "UTC";
    }

    // Set both timezones to UTC to disable converting between them
    if (this.ignoreTimezone) {
      this.appTimezone = "UTC";
      this.timezone = "UTC";
    }
  };

  DatePicker.DEFAULTS = {
    minDate: null,
    maxDate: null,
    format: null,
    yearRange: "c-10:c+10",
    firstDay: 0,
    showWeekNumber: false,
    mode: "datetime",
  };

  // PLUGIN DEFINITION
  // ============================

  var old = $.fn.datePicker;

  $.fn.datePicker = function (option) {
    var args = Array.prototype.slice.call(arguments, 1),
      items,
      result;

    items = this.each(function () {
      var $this = $(this);
      var data = $this.data("oc.datePicker");
      var options = $.extend(
        {},
        DatePicker.DEFAULTS,
        $this.data(),
        typeof option == "object" && option
      );
      if (!data)
        $this.data("oc.datePicker", (data = new DatePicker(this, options)));
      if (typeof option == "string") result = data[option].apply(data, args);
      if (typeof result != "undefined") return false;
    });

    return result ? result : items;
  };

  $.fn.datePicker.Constructor = DatePicker;

  $.fn.datePicker.noConflict = function () {
    $.fn.datePicker = old;
    return this;
  };

  $(document).on("render", function () {
    $('[data-control="datepicker"]').datePicker();
  });
})(window.jQuery);
