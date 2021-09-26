var socket = io();
socket.on("newdata", function (msg) {
  // dan = msg.array.(element => {
  //   if(element.districtId='dan')
  //   return element
  // });
  let element = document.getElementById("dan").children[0];
  element.innerText = 100000000;

  // var element = document.getElementById(msg.districtId);
  // element.innerText = msg.value;
});
