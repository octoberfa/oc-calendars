+(function () {
    const ordinalSuffixOf = function (i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    };
    const luxonMomentFormat = function (datetime, format) {
        let result = "";
        //replace timezone
        format = format
            .replace(/ZZ/g, "____!!____")
            .replace(/Z/g, "ZZ")
            .replace(/____\!\!____/g, "ZZZ")
            .replace(/zz/g, "____!!____")
            .replace(/z/g, "ZZZZ")
            .replace(/____\!\!____/, "z")
            .replace(/S{2,}/g, "SSS")
            .replace(/a/g, "__(1)__")
            .replace(/A/g, "a")
            .replace(/Mo/g, "__(2)__")
            .replace(/Qo/g, "__(3)__")
            .replace(/Q/g, "q")
            .replace(/DDDD/g, "ooo")
            .replace(/DDDo/g, "__(4)__")
            .replace(/DDD/g, "o")
            .replace(/DD/g, "___(1)___")
            .replace(/Do/g, "__(5)__")
            .replace(/D/g, "___(2)___")
            .replace(/dddd/g, "EEEE")
            .replace(/dddd/g, "EEE")
            .replace(/dd/g, "EEEEE")
            .replace(/do/g, "__(5)__")
            .replace(/d/g, "E")
            .replace(/e/g, datetime.toFormat("E") - 1)
            .replace(/ww/g, datetime.toFormat("kk").padStart(2, "0"))
            .replace(/wo/g, "__(7)__")
            .replace(/w/g, "kk")
            // todo do this right
            .replace(/YYYYYY/g, "")
            .replace(/YYYY/g, "yyyy")
            .replace(/YY/g, "yy")
            .replace(/Y/g, "y")
            .replace(/NNNNN/g, "G")
            .replace(/NNNN/g, "GG")
            .replace(/NNN/g, "G")
            .replace(/NN/g, "G")
            .replace(/N/g, "G")
            .replace(/kk/g, "___(3)___")
            .replace(/k/g, "___(4)___")
            .replace(/gggg/gi, "kkkk")
            .replace(/gg/gi, "kk")
            .replace(/HH/g, datetime.toFormat("H") - 1)
            .replace(
                /HH/g,
                (datetime.toFormat("H") - 1).toString().padStart(2, "0")
            )
            .replace("/LTs/g", "tt")
            .replace(/LT/g, "t")
            .replace(/LLLL/g, "DDDD t")
            .replace(/LLL/g, "DDD t")
            .replace(/LL/g, "DDD")
            .replace(/L/g, "D")
            .replace(/llll/g, "EEE, DD t")
            .replace(/lll/g, "DD t")
            .replace(/ll/, "DD")
            .replace(/l/g, "D")
            .replace(/___\(1\)___/g, "dd")
            .replace(/___\(2\)___/g, "d")
            .replace(/___\(3\)___/g, "H")
            .replace(/___\(4\)___/g, "HH");

        result = datetime.toFormat(format);

        const meridiem = datetime.toFormat("a").toLowerCase();
        const ordinalSuffixMonth = ordinalSuffixOf(datetime.toFormat("M"));
        const ordinalSuffixQuarter = ordinalSuffixOf(datetime.toFormat("q"));
        const ordinalSuffixDayOfYear = ordinalSuffixOf(datetime.toFormat("o"));
        const ordinalSuffixDayOfMonth = ordinalSuffixOf(
            datetime.toFormat("dd")
        );
        const ordinalSuffixDayOfWeek = ordinalSuffixOf(datetime.toFormat("E"));
        const ordinalSuffixWeekOfYear = ordinalSuffixOf(
            datetime.toFormat("kk")
        );
        result = result
            .replace(/__\(1\)__/g, meridiem)
            .replace(/__\(2\)__/g, ordinalSuffixMonth)
            .replace(/__\(3\)__/g, ordinalSuffixQuarter)
            .replace(/__\(4\)__/g, ordinalSuffixDayOfYear)
            .replace(/__\(5\)__/g, ordinalSuffixDayOfMonth)
            .replace(/__\(6\)__/g, ordinalSuffixDayOfWeek)
            .replace(/__\(7\)__/g, ordinalSuffixWeekOfYear);

        return result;
    };
    window.LuxonMomentFormat = luxonMomentFormat;
})();
