var client = {};
const socket_protocol = window.location.protocol === "https:" ? "wss" : "ws";
const socket = new WebSocket("ws://" + window.location.host);

socket.addEventListener("open", (event) => {
  console.log("server opened");
});

socket.addEventListener("message", (msg) => {
  console.log("Recieved", msg.data);

  var recdMsg = JSON.parse(msg.data);

  switch (recdMsg.type) {
    case "messageRecd":
      {
        console.log("here", recdMsg.messageContent);
        $(
          '<li class="replies"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p class="uname">'+recdMsg.author+'</p><p>' +
            recdMsg.messageContent +
            "</p></li>"
        ).appendTo($(".messages ul"));
        $(".messages").animate({ scrollTop: $(document).height() }, "fast");
      }
      break;
  }
});

client.openConn = (name) => {
  try {
    console.log("here");
    var msg = JSON.stringify({
      type: "register",
      name,
    });
    client.name = name;
    console.log("MESG", msg);
    socket.send(msg);
  } catch (e) {
    console.log(e);
  }
};

client.sendMessage = (message) => {
  var msg = JSON.stringify({
    type: "messageSent",
    messageContent: message,
    author: client.name,
  });
  socket.send(msg);
};

client.getInfo = () => {
  var name = $("#profile").attr("name");
  console.log("HERE", name, client);
  client.openConn(name);
};
