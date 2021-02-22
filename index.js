$(".rotation-row").css("display", "none");
$(".move-row").css("display", "none");

$("#t-cycle").val(0.2);
$("#voltage").val(8);
$("#max-voltage").val(10);
var angle = 10;
$("#input-angle").val(angle);

var ln = [
  [0, 1, 1, 0, 0, 0, 1, 1],
  [0, 0, 1, 1, 1, 0, 0, 1],
  [0, 0, 0, 0, 1, 1, 1, 1]
];

var xs = 0.2;
var ys = 0.4;
var u07s = 0.6;
var xn = 1;
var yn = 2;
var u0, u7, x, y;

google.charts.load('current', {
  'packages': ['corechart']
});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  for (var i = 0; i < 3; i++) {
    var data = google.visualization.arrayToDataTable([
      ['', ''],
      [u07s, 0],
      [(u07s + xs), ln[i][xn]],
      [(u07s + xs + ys), ln[i][yn]],
      [(u07s + xs + ys), 1],
      [(3 * u07s + xs + ys), 1],
      [(3 * u07s + xs + 2 * ys), ln[i][yn]],
      [(3 * u07s + 2 * xs + 2 * ys), ln[i][xn]],
      [(4 * u07s + 2 * xs + 2 * ys), 0]
    ]);
    var j = i + 1;
    var options = {
      backgroundColor: "#fff",
      colors: ["#212529"],
      title: "L" + j,
      isStacked: true
    };
    var chart = new google.visualization.SteppedAreaChart(
      document.getElementById("L" + j));
    chart.draw(data, options);
  }
}

$("#increment").click(function() {
  angle = $("#input-angle").val();
  angle++;
  $("#input-angle").val(angle);
  setArrow(angle);
});
$("#decrement").click(function() {
  angle = $("#input-angle").val();
  angle--;
  $("#input-angle").val(angle);
  setArrow(angle);
});
$("#input-angle").on("input", function() {
  angle = $("#input-angle").val();
  setArrow(angle);
});
$("#t-cycle").on("input", function() {
  angle = $("#input-angle").val();
  setArrow(angle);
});
$("#voltage").on("input", function() {
  angle = $("#input-angle").val();
  setArrow(angle);
});
$("#max-voltage").on("input", function() {
  angle = $("#input-angle").val();
  setArrow(angle);
});

function adjustChartOnAngleChange(alpha) {
  var tc = $("#t-cycle").val();
  var v = $("#voltage").val();
  var maxV = $("#max-voltage").val();
  var k = Math.abs(tc * (v / maxV));
  var t0, t1, t2;
  var alpha1, alpha2, alphaRad1, alphaRad2;
  var degreeToRad = (Math.PI / 180);
  var alphaFactor, swap;
  if (alpha >= 0) {
    if (alpha < 60) {
      xn = 1;
      yn = 2;
      alphaFactor = 0;
      swap = false;
    } else if (alpha < 120) {
      xn = 2;
      yn = 3;
      alphaFactor = 1;
      swap = true;
    } else if (alpha < 180) {
      xn = 3;
      yn = 4;
      alphaFactor = 2;
      swap = false;
    } else if (alpha < 240) {
      xn = 4;
      yn = 5;
      alphaFactor = 3;
      swap = true;
    } else if (alpha < 300) {
      xn = 5;
      yn = 6;
      alphaFactor = 4;
      swap = false;
    } else if (alpha < 360) {
      xn = 6;
      yn = 1;
      alphaFactor = 5;
      swap = true;
    } else if (alpha >= 360) {
      alpha = alpha % 360;
      adjustChartOnAngleChange(alpha);
      return;
    }
  } else {
    if (alpha >= -360) {
      alpha += 360;
    } else {
      alpha *= -1;
      alpha = alpha % 360;
    }
    adjustChartOnAngleChange(alpha);
    return;
  }
  alpha -= (alphaFactor * 60);
  alpha1 = 60 - alpha;
  alphaRad1 = alpha1 * degreeToRad;
  alpha = alpha * degreeToRad;
  t1 = k * Math.sin(alphaRad1);
  t2 = k * Math.sin(alpha);
  t0 = tc - t1 - t2;
  xs = t1 / 2;
  ys = t2 / 2;
  u07s = t0 / 4;
  u0 = "u0\n(" + (u07s) + ")";
  u7 = "u7\n(" + (u07s) + ")";
  if (swap) {
    var temp = yn;
    yn = xn;
    xn = temp;
    temp = ys;
    ys = xs;
    xs = temp;
  }
  x = "u" + xn + "\n(" + (xs) + ")";
  y = "u" + yn + "\n(" + (ys) + ")";
  drawChart();
  adjustTableOnAngleChange();
}

function adjustTableOnAngleChange() {
  $(".xn").text("U" + xn);
  $(".yn").text("U" + yn);
  var temp = u07s;
  $(".u0-1").text(temp.toFixed(4));
  temp = u07s + xs;
  $(".ux-1").text(temp.toFixed(4));
  temp = u07s + xs + ys;
  $(".uy-1").text(temp.toFixed(4));
  temp = 2 * u07s + xs + ys;
  $(".u7-1").text(temp.toFixed(4));
  temp = 3 * u07s + xs + ys;
  $(".u7-2").text(temp.toFixed(4));
  temp = 3 * u07s + xs + 2 * ys;
  $(".uy-2").text(temp.toFixed(4));
  temp = 3 * u07s + 2 * xs + 2 * ys;
  $(".ux-2").text(temp.toFixed(4));
  temp = 4 * u07s + 2 * xs + 2 * ys;
  $(".u0-2").text(temp.toFixed(4));
}

function setArrow(angle) {
  $("#arrow").css("transform", "rotate(" + (-angle) + "deg)");
  adjustChartOnAngleChange(angle);
}

var intervalId;
$(".rotate").click(function() {
  clearInterval(intervalId);
  intervalId = window.setInterval(function() {
    if (angle == 360) angle = 0;
    setArrow(angle);
    $("#input-angle").val(angle);
    angle++;
  }, 100);
});

$(".stop").click(function() {
  clearInterval(intervalId);
});
var mouseActivated = false;
$("input[type=radio][name=btnradio]").change(function() {
  clearInterval(intervalId);
  if (this.value == "angle") {
    $(".adjust-row").css("display", "");
    $(".rotation-row").css("display", "none");
    $(".move-row").css("display", "none");
    $("#input-angle").val(angle);
    $("#input-angle").prop("disabled", false);
    $("#t-cycle").prop("disabled", false);
    $("#voltage").prop("disabled", false);
    $("#max-voltage").prop("disabled", false);
    mouseActivated = false;
  } else if (this.value == "rotation") {
    $(".adjust-row").css("display", "none");
    $(".rotation-row").css("display", "");
    $(".move-row").css("display", "none");
    $("#input-angle").prop("disabled", true);
    $("#t-cycle").prop("disabled", true);
    $("#voltage").prop("disabled", true);
    $("#max-voltage").prop("disabled", true);
    mouseActivated = false;
  } else if (this.value == "drag") {
    $(".adjust-row").css("display", "none");
    $(".rotation-row").css("display", "none");
    $(".move-row").css("display", "");
    $("#input-angle").prop("disabled", true);
    $("#t-cycle").prop("disabled", true);
    $("#voltage").prop("disabled", true);
    $("#max-voltage").prop("disabled", true);
    mouseActivated = true;
  }
});
setTimeout(function() {
  setArrow(angle);
}, 1000);

var mouseX, mouseY, dx, dy, a;
var circle = $("#circle");
var circleX = circle.offset().left + (circle.width() / 2);
var circleY = circle.offset().top + (circle.height() / 2);

document.addEventListener("touchmove", function(e) {
    e.preventDefault();
    var touch = e.touches[0];
    dx = touch.pageX - circleX;
    dy = touch.pageY - circleY;
    onMoveCursorOrTouch();
}, false);
$(document).mousemove(function(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
  dx = mouseX - circleX;
  dy = mouseY - circleY;
  onMoveCursorOrTouch();
});
function onMoveCursorOrTouch(){
  if(Math.abs(dx)>(50 + circle.width()/2)  ||
     Math.abs(dy)>(50 + circle.height()/2) ||
     !mouseActivated){
      return;
  }
  a = Math.atan(dy/dx) * (180 / Math.PI);
  if(dx>0 && dy<0){ // 1st quarter
    a *= -1;
  }else if(dx<0 && dy<0){ // 2nd quarter
    a = 180 - a;
  }else if(dx<0 && dy>0){ // 3rd quarter
    a = (-1*a) + 180;
  }else if(dx>0 && dy>0){ // 4th quarter
    a = 360 - a;
  }
  angle = a.toFixed(1);
  $("#input-angle").val(angle);
  setArrow(angle);
}
