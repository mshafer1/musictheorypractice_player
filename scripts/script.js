KEYS = {
    n: "n",
    song: "song",
    width: "width",
    title: "title",
}


function load() {
    _get_data = load_get();
    _debug_log(_get_data);

    if (Object.keys(_get_data).length == 0 || !(KEYS.n in _get_data) || !(KEYS.song in _get_data)) {
        $('#message').html("<p>Error: must provide song and n in url</p>")
    }

    var title = "";
    if (KEYS.title in _get_data) {
        title = _get_data[KEYS.title];
    }

    setup_player(_get_data[KEYS.n], _get_data[KEYS.song], title);

    if (KEYS.width in _get_data) {
        width = 80
        try {
            width = parseFloat(_get_data[KEYS.width]) * 100;
            _debug_log("Got width: ", width);
        } catch {
            // pass
        }
        $('.js_bar').width(`${ width }%`)
    }
}

function setup_player(n, song, title) {
    row = genRow(n, song, title);
    _debug_log("Row: ", row)
    $('#player').html(row);
}

function genRow(n, audioPath, title) {
    //console.log("index: " +index);
    result = `   
    <div class="w3-row-padding w3-padding w3-display-middle ">
        <div class="w3-col s12 m6">
        <audio id="_player_raw" class="player" onended="stop()">
           <source src="${audioPath}" type="audio/mpeg"/>
        </audio>
    `
    for (var i = 0; i < n; i++) {
        result += `
       
       <button id="playButton${i}" class="${_HOVER_COLOR} playButton w3-margin w3-btn" onclick="play(\'${i}\')"><i class="fas fa-play"/></button>`
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
    `

    return result;
}

_HOVER_COLOR = "w3-hover-grey"

function play(id) {
    // TODO: make sure all others are stopped
    stop();
    var player = document.getElementById('_player_raw');
    player.currentTime = 0; // do reset the player
    player.play();
    removeEventListener("ended", stop, false)

    $('#playButton' + id).prop("disabled", true).removeClass(_HOVER_COLOR);
    $('#playButton' + id).attr("onclick", "");
}

function stop() {
    var player = $('#_player_raw')[0]
    player.pause();
}
