
setTime = () => {
    d = new Date(); //object of date()
    hr = d.getHours();
    min = d.getMinutes();
    sec = d.getSeconds();
    hr_rotation = 30 * hr + min / 2; //converting current time
    min_rotation = 6 * min;
    sec_rotation = 6 * sec;

    hour.style.transform = `rotate(${hr_rotation}deg)`;
    minute.style.transform = `rotate(${min_rotation}deg)`;
    second.style.transform = `rotate(${sec_rotation}deg)`;
}

setTime();

setInterval(() => {
    setTime();
}, 1000);

var mousePosition;
var offset = [0, 0];
var div;
var isDown = false;

div = document.getElementById("clockContainer");

div.addEventListener('mousedown', function (e) {
    if (div) {
        isDown = true;
        offset = [
            div.offsetLeft - e.clientX,
            div.offsetTop - e.clientY
        ];
    }
}, true);

document.addEventListener('mouseup', function () {
    isDown = false;
}, true);

document.addEventListener('mousemove', function (event) {
    event.preventDefault();
    if (isDown && div) {
        mousePosition = {

            x: event.clientX,
            y: event.clientY

        };
        div.style.left = (mousePosition.x + offset[0]) + 'px';
        div.style.top = (mousePosition.y + offset[1]) + 'px';
    }
}, true);