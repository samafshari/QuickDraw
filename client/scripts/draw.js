var ROOM = "0";
var COLOR = "black";
var RADIUS = 5;

var socket, canvas, context;

function get_param(name) {
    var url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

function change_color(color)
{
    COLOR = color;
}

function get_draw(draw_data)
{
    var rect = canvas.getBoundingClientRect();
    if (draw_data["shape"] == "circle")
    {
        draw_data["x"] = (draw_data["x"] / 1000.0) * canvas.width;
        draw_data["y"] = (draw_data["y"] / 1000.0) * canvas.height;

        context.beginPath();
        context.arc(draw_data["x"], draw_data["y"], draw_data["radius"], 0, 2 * Math.PI, false);
        context.fillStyle = draw_data["color"];
        context.fill();
    }
}

function get_room(room_data)
{
    room_data.forEach(function (e, i) {
        draw(e);
    });
}

function get_clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function handle_message(msg)
{
    if ("room" in msg) {
        if (msg["room"] != ROOM) return;
    }
    else return;

    if (!("command" in msg)) return;

    if (msg["command"] == "draw") get_draw(msg["data"]);
    if (msg["command"] == "clear") get_clear();
    if (msg["command"] == "send_room") get_room(msg["data"]);
}

function clear_room() {
    socket.emit("message", {
        "room": ROOM,
        "command": "clear"
    });
}

var draw_enabled = false;
function mouse_paint(event)
{
    if (!draw_enabled) return;

    var rect = canvas.getBoundingClientRect();
    var x = event.x - rect.left;
    var y = event.y - rect.top;

    socket.emit("message", {
        "room": ROOM,
        "command": "draw",
        "data": {
            "shape": "circle",
            "x": 1000.0 * (x / rect.width),
            "y": 1000.0 * (y / rect.height),
            "radius": RADIUS,
            "color": COLOR
        },
    })
}

function mouse_down(event)
{
    draw_enabled = true;
    mouse_paint(event);
}

function mouse_move(event)
{
    mouse_paint(event);
}

function mouse_up(event)
{
    draw_enabled = false;
}

function initialize() {
    ROOM = get_param("room");
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.addEventListener("mousedown", mouse_down, false);
    canvas.addEventListener("mousemove", mouse_move, false);
    canvas.addEventListener("mouseup", mouse_up, false);

    socket = io();
    socket.on("servermessage", handle_message);

    socket.emit("message", {
        "room": ROOM,
        "command": "join"
    });
}

window.addEventListener("load", initialize);