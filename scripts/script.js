KEYS = {
    n: "n",
    song: "song",
    width: "width",
    title: "title",
    exp_days: "duration",
    bg_color: "bg_color",
    btn_color: "btn_color",
    btn_hover_color: "btn_hover_color",
}

var previous_plays = 0;
var DEFAULT_EXDAYS = -1;
var song_key = '';

var BACKGROUND_COLOR = 'w3-dark-grey';
var BTN_COLOR = 'w3-black';
var BTN_HOVER_COLOR = "w3-hover-grey";

// add lstrip to String
String.prototype.lstrip = function () {
    return this.replace(/^\s*/g, "")
}


function load() {
    _get_data = load_get();
    _debug_log("Parsed Data:", _get_data);

    if (KEYS.width in _get_data) {
        width = 80
        try {
            width = parseFloat(_get_data[KEYS.width]) * 100;
            _debug_log("Got width: ", width);
        } catch {
            // pass
        }
        $('.js_bar').width(`${width}%`)
    }

    if (Object.keys(_get_data).length == 0 || !(KEYS.song in _get_data)) {
        $('#message').html("<p>Error: must provide 'song' in url</p>")
        return;
    }

    var n = 1
    if (KEYS.n in _get_data) {
        try {
            n = parseInt(_get_data[KEYS.n]);
        } catch {
            // pass
        }
    }

    var title = "";
    if (KEYS.title in _get_data) {
        title = _get_data[KEYS.title];
    } else {
        _debug_log("Using default title");
    }

    if (KEYS.exp_days in _get_data) {
        DEFAULT_EXDAYS = parseInt(_get_data[KEYS.exp_days]) || -1;
    }

    if(KEYS.bg_color in _get_data) {
        _debug_log("Seeting background color to:", _get_data[KEYS.bg_color]);
        BACKGROUND_COLOR = _get_data[KEYS.bg_color];
    }

    if(KEYS.btn_color in _get_data) {
        BTN_COLOR = _get_data[KEYS.btn_color];
    }

    if(KEYS.btn_hover_color in _get_data) {
        BTN_HOVER_COLOR = _get_data[KEYS.btn_hover_color];
    }

    setup_player(n, _get_data[KEYS.song], title);
}

function setup_player(n, song, title) {
    song_key = song + ((title.length > 0) ? `::${title}` : '');
    // _debug_log("song_key", song_key);
    var previous_n = _get_previous_plays(song_key)
    previous_plays = previous_n;
    _debug_log("Title:")
    _debug_log('"' + title + '"');
    row = genRow(n, song, title, previous_n);
    // _debug_log("Row: ", row)
    $('#player').removeClass('w3-dark-grey').addClass(BACKGROUND_COLOR);
    $('#player').html(row);
}

function genRow(n, audioPath, title, previous_n) {
    //console.log("index: " +index);
    var result = `   
    <div class="w3-row-padding w3-padding ">
        <div class="w3-col s12 m6">
        <audio id="_player_raw" class="player" onended="stop()">
           <source src="${audioPath}" type="audio/mpeg"/>
        </audio>
    `
    for (var i = 0; i < n; i++) {
        var disable = i < previous_n;

        var onclick = (disable) ? `disabled="disabled"` : `onclick="play(\'${i}\')"`;


        result += `
    
        <button id="playButton${i}" class="w3-btn ${BTN_COLOR} ${BTN_HOVER_COLOR} playButton w3-margin" ${onclick}><i class="fas fa-play"/></button>`
    }

    result +=
        `
        </div>
    `

    result +=
        `
        <div class="w3-col s12 m6">
        <p>${title}</p>
        </div>
    </div>
    `

    return result;
}

function play(id) {
    // TODO: make sure all others are stopped
    stop();

    previous_plays += 1;
    _set_previous_plays(song_key, previous_plays);

    $('#playButton' + id).prop("disabled", true).removeClass(BTN_HOVER_COLOR);
    $('#playButton' + id).attr("onclick", "");


    var player = document.getElementById('_player_raw');
    player.currentTime = 0; // do reset the player
    player.play();
}

function stop() {
    var player = $('#_player_raw')[0]
    player.pause();
}

const DATA_STORAGE_LOCATION = '_a';

function _build_storage_path(file) {
    var path = `${DATA_STORAGE_LOCATION}/${file}::plays`;
    return path;
}

function _get_previous_plays(file) {
    var path = _build_storage_path(file);

    var result = 0;
    try {
        var _data = _read_data(path);
        result = parseInt(_data) || 0;
        _debug_log(`{Result: ${result}}`);
    } catch {
        // pass
    }
    return result;
}

function _set_previous_plays(key, n) {
    var target_path = _build_storage_path(key);
    try {
        _set_data(target_path, n);
    }
    catch (e) {
        // pass - log it and move on
        _debug_log(e);
    }
}

function setStorage(name, value) {
    try {
        localStorage.setItem(name, value);
    }
    catch (e) {
        // pass - log it and move on
        _debug_log(e);
    }
}

function getStorage(name) {
    try {
        storage = window.localStorage;

        result = "";
        for (var key in storage) {
            if (key == path) {
                result = storage[key]
                _debug_log(`{Key: ${key}, Value: ${result}}`);
                break;
            }
        }
        return result;
    } catch (e) {
        _debug_log(e);
        return "";
    }
}

// from https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays = NaN) {
    exdays = exdays || DEFAULT_EXDAYS;
    if (exdays < 0 && DEFAULT_EXDAYS > 0) {
        exdays = DEFAULT_EXDAYS;
    }
    _debug_log("EXDays: ", exdays, "\ncname: ", cname);
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function getCookie(cname) {
    //console.log("Reading cookie: ", cname);
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].replace(/^\s*/g, "");
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function _can_set_cookie() {
    var result = false;
    //console.log("checking cookies");
    try {
        setCookie("a", 1, 1);
        var answer = getCookie("a");
        if (answer == "1") {
            _debug_log("use cookies");
            result = true;
        }
        else {
            _debug_log("DON'T use cookies");
        }
    } catch {
        // pass
    }
    return result;
}

function no_op() {
    // NO-OP;
}

var use_cookies = _can_set_cookie();

_set_data = (use_cookies) ? setCookie : no_op;
_read_data = (use_cookies) ? getCookie : no_op;
