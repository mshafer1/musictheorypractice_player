DEBUG_LOGGING_ENABLED = false;

function _debug_log() {
    if (!DEBUG_LOGGING_ENABLED) {
        return; // NO-OP
    }

    console.debug(...arguments);
}

function escapeRegExp(str) { // from https://stackoverflow.com/a/1144788/8100990
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function _load_get(location) {
    var result = {}

    // enable debug logging if asked
    if(location.includes('ENABLE_DEBUG_LOGGIN')) {
        DEBUG_LOGGING_ENABLED = true;
    }

    if (location.indexOf('?') == -1) {
        _debug_log("No query string");
        return result;
    }
    var query = location
        // get the query string
        .replace(/^.*?\?/, '')
        // and remove any existing hash string (thanks, @vrijdenker)
        .replace(/#.*$/, '')
        .replace(new RegExp(escapeRegExp('+'), 'g'), ' ')
        .split('&');

    for (var i = 0, l = query.length; i < l; i++) {
        aux = decodeURIComponent(query[i])
        _debug_log(aux)
        key = aux.match(/([\d\D]+?\=)/)[0].replace('=', '');
        _debug_log(key)
        value = aux.replace(key + "=", "")
        _debug_log(value)
        if (key in result) {
            if (result[key].constructor === Array) {
                result[key].push(value)
            } else {
                result[key] = [result[key], value]
            }
        } else {
            if (key.includes('[]')) {
                _debug_log("Array detected")
                result[key] = [];
                result[key].push(value)
            } else {
                result[key] = value;
            }
            _debug_log(key + ":" + result[key])
            _debug_log();
        }
    }

    return result;
}

function load_get() { //originally from https:///stackoverflow.com/a/12049737
    GET = _load_get(document.location.toString());
    return GET;
}

try {
    // from https://stackoverflow.com/a/11279639
    // if module is availble, we must be getting included via a 'require', export methods
    var exports = module.exports = {};

    exports._load_get = _load_get;
} catch (error) {
    // pass
}