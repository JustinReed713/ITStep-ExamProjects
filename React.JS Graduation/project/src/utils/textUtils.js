export function textCapitalizer(string) {
    return string[0].toUpperCase() + string.slice(1, string.length);
};

export function dateTranslate(string) {
    return string.split(".").reverse().join("-");
}

export function dateReverse(string) {
    return string.split("-").reverse().join("-");
}

export function variableToString(string) {
    return textCapitalizer(string.split(/\B(?=[A-Z])/).map((item) => item.toLowerCase()).join(" "));
}