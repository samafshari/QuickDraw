
function btn_connect_pressed() {
    var txt_room = document.getElementById("txt_room");
    var room_name = txt_room.value;
    window.location.href = "/draw.html?room=" + room_name;
}
