/**
 * Created by perry on 16/1/15.
 */
var canvasWidth = Math.min(800, $(window).width() - 20);
var canvasHeight = canvasWidth;

var isMouseDown = false;
var lastLoc = {x: 0, y: 0};
var lastTimeStamp = 0;
var lastLineWidth = -1;
var strokeColor = "black";
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;

$("#controller").css("width", canvasWidth + "px");
drawGrid();


$("#clear_btn").click(
    function (e) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        drawGrid();
    }
);

$(".color_btn").click(function (e) {
    $(".color_btn").removeClass("color_btn_selected");
    $(this).addClass("color_btn_selected");
    strokeColor = $(this).css("background-color");
});

//document.onmousedown = function (e) {
//    alert(e.clientX + "," + e.clientY);
//};
/*开始时*/
function beginStroke(point) {
    isMouseDown = true;
    var loc = windowToCanvas(point.x, point.y);
    lastLoc = loc;
    lastTimeStamp = new Date().getTime();
}
/*结束后*/
function endStroke() {
    isMouseDown = false;
}
/*绘制过程中的动作*/
function moveStroke(point) {
    var curLoc = windowToCanvas(point.x, point.y);
    var curTimeStamp = new Date().getTime();
    var s = calcDistance(curLoc, lastLoc);
    var t = curTimeStamp - lastTimeStamp;

    var lineWidth = calcLineWidth(t, s);
    //draw

    context.beginPath();
    context.moveTo(lastLoc.x, lastLoc.y);
    context.lineTo(curLoc.x, curLoc.y);

    context.strokeStyle = strokeColor;
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.linejoin = "round";
    context.stroke();

    lastLoc = curLoc;
    lastTimeStamp = curTimeStamp;
    lastLineWidth = lineWidth;
}

canvas.onmousedown = function (e) {
    e.preventDefault();
    beginStroke({x: e.clientX, y: e.clientY});
};
canvas.onmouseup = function (e) {
    e.preventDefault();
    endStroke();
};
canvas.onmouseout = function (e) {
    e.preventDefault();
    endStroke();
};
canvas.onmousemove = function (e) {
    e.preventDefault();
    if (isMouseDown) {
        moveStroke({x: e.clientX, y: e.clientY});
    }
};
var touch;
/*触控事件*/
canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    touch = e.touches[0];
    beginStroke({x: touch.pageX, y: touch.pageY});
});
canvas.addEventListener("touchmove", function (e) {
    e.preventDefault();
    if (isMouseDown) {
        touch = e.touches[0];
        moveStroke({x: touch.pageX, y: touch.pageY});
    }
});
canvas.addEventListener("touchend", function (e) {
    e.preventDefault();
    endStroke();
});
/*计算要绘制线条的宽*/
function calcLineWidth(t, s) {
    var v = s / t;

    var resultLineWidth;
    if (v <= 0.1) {
        resultLineWidth = 30;
    } else if (v >= 10) {
        resultLineWidth = 1;
    } else {
        resultLineWidth = 30 - (v - 0.1) / (10 - 0.1) * (30 - 1);
    }
    if (lastLineWidth = -1) {
        return resultLineWidth;
    }
    return lastLineWidth * 2 / 3 + resultLineWidth * 1 / 3;
}

/*求两坐标间的距离*/
function calcDistance(loc1, loc2) {
    return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y));//x轴距离的平方与上y轴距离的平方的和再开根号;
}

/*获取canvas上的坐标点*/
function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {x: Math.round(x - bbox.left), y: Math.round(y - bbox.top)};
}

/*绘米字格*/
function drawGrid() {
    context.save();

    context.strokeStyle = "rgb(230,11,9)";

    context.beginPath();
    context.moveTo(3, 3);
    context.lineTo(canvasWidth - 3, 3);
    context.lineTo(canvasHeight - 3, canvasHeight - 3);
    context.lineTo(3, canvasHeight - 3);
    context.closePath();

    context.lineWidth = 6;
    context.stroke();

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(canvasWidth, canvasHeight);

    context.moveTo(canvasWidth, 0);
    context.lineTo(0, canvasHeight);

    context.moveTo(canvasWidth / 2, 0);
    context.lineTo(canvasWidth / 2, canvasHeight);

    context.moveTo(0, canvasHeight / 2);
    context.lineTo(canvasWidth, canvasHeight / 2);

    context.lineWidth = 1;
    context.stroke();

    context.restore();
}