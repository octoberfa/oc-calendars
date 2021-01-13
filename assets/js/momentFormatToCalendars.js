const MomentFormatToCalendars = function (format) {
    return format
        .replace(/do|d{1,4}/g, "")
        .replace(/e/gi, "")
        .replace(/wo/g, "w")
        .replace(/MMMM/g, "___(1)___")
        .replace(/MMM/g, "___(2)___")
        .replace(/MM/g, "___(3)___")
        .replace(/M/g, "___(4)___")
        .replace(/Q|Qo/g, "")
        .replace(/DDDD/g, "o")
        .replace(/DDDo|DDD/g, "o")
        .replace(/DD/g, "dd")
        .replace(/D|Do/g, "d")
        .replace(/WW/g, "ww")
        .replace(/Wo/g, "w")
        .replace(/W/g, "w")
        .replace(/YYYYYY/g, "")
        .replace(/YYYY/g, "yyyy")
        .replace(/Y{1,2}/g, "y")
        .replace(/N{1,5}/, "")
        .replace(/g{2,4}/gi, "")
        .replace(
            /a|A|H{1,2}|h{1,2}|k{1,2}|m{1,2}|S{1,9}|z{1,2}|LTS|LT|L{1,4}|l{2,4}/g,
            ""
        )
        .replace(/l/g, "m/d/yyyy")
        .replace(/x/gi, "@")
        .replace(/___\(1\)___/g, "MM")
        .replace(/___\(2\)___/g, "M")
        .replace(/___\(3\)___/g, "mm")
        .replace(/___\(4\)___/g, "m");
};
