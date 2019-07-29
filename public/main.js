$(document).ready(function() {
  var socket = io();
  var data = null;

  function loginPage() {
    $("#registerPage").hide();
    $("#wrapperChat").hide();
    $("#loginPage").show();
  }

  function registerPage() {
    $("#wrapperChat").hide();
    $("#loginPage").hide();
    $("#registerPage").show();
  }

  function chatPage() {
    $("#loginPage").hide();
    $("#registerPage").hide();
    $("#inputFile").hide();
    $("#cancelAddFile").hide();
    $("#wrapperChat").show();
  }

  function addFile() {
    $("#inputFile").show();
    $("#cancelAddFile").show();
  }

  function checkLogin() {
    if (localStorage.token && localStorage.email && localStorage.name) {
      chatPage();
    } else {
      loginPage();
    }
  }

  function login(e) {
    e.preventDefault();
    //action axios ke endpoint login
    axios({
      url: "http://localhost:4000/users/login",
      method: "post",
      data: {
        email: $("#emailLogin").val(),
        password: $("#passwordLogin").val()
      }
    })
      .then(res => {
        Swal.fire("Login Success");
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("token", res.data.token);
        chatPage();
      })
      .catch(error => {
        console.log(
          "ERROR",
          _.get(error, "response.data.message", "cannot login")
        );
        Swal.fire(_.get(error, "response.data.message", "cannot login"));
        loginPage();
      });
  }

  function register(e) {
    e.preventDefault();
    //action axios ke endpoint register
    axios({
      url: "http://localhost:4000/users",
      method: "post",
      data: {
        name: $("#nameRegister").val(),
        email: $("#emailRegister").val(),
        password: $("#passwordRegister").val()
      }
    })
      .then(res => {
        Swal.fire("Register Success");
        loginPage();
      })
      .catch(error => {
        console.log(
          "ERROR",
          _.get(error, "response.data.message", "cannot Register")
        );
        Swal.fire(_.get(error, "response.data.message", "cannot Register"));
        registerPage();
      });
  }

  function readThenSendFile(data) {
    var socket = io();
    var reader = new FileReader();
    reader.onload = function(evt) {
      var msg = {};
      console.log("data", data);
      console.log("evt", evt);
      msg.username = "anhar";
      msg.file = evt.target.result;
      msg.fileName = data.name;
      socket.emit("sendFile", msg);
    };
    reader.readAsDataURL(data);
  }

  $("#loginForm").submit(function(e) {
    login(e);
  });

  $("#btnLogin").click(function(e) {
    login(e);
  });

  $("#btnRegister").click(function(e) {
    register(e);
  });

  $("#btnToRegister").click(function(e) {
    e.preventDefault();
    registerPage();
  });

  $("#btnToLogin").click(function(e) {
    e.preventDefault();
    loginPage();
  });

  $("#addFile").click(function(e) {
    e.preventDefault();
    addFile();
  });

  $("#cancelAddFile").click(function(e) {
    e.preventDefault();
    chatPage();
  });

  $("#addGroup").click(function(e) {
    e.preventDefault();
    alert("action untuk add group");
  });

  $("#addFriend").click(function(e) {
    e.preventDefault();
    alert("action untuk add group");
  });

  $("#btnLogout").click(function(e) {
    e.preventDefault();
    localStorage.clear();
    loginPage();
  });

  socket.on("chat", function(data) {
    // $("#listmessage").append($("<h5>").text(localStorage.name));
    // $("#listmessage").append($("<h5>").text(data));
    $("#listmessage").append(
      $("<h6 class='senderName'>").text(localStorage.name),
      $("<h5>").text(data),
      $("<p class='createdAt'>").text(moment(new Date()).format("lll")),
      $("<hr/>")
    );
    // $("#listmessage").append($("<hr/>"));
  });

  socket.on("sendFile", function(data) {
    console.log("data send FIle ", data);
    $("#listmessage").append(
      $("<h6 class='senderName'>").text(localStorage.name),
      $(
        `<a target="_blank" download rel="noopener noreferrer" 
          href="${data.file}" id="filedownload${data.fileName}">
          ${data.fileName}
        </a>
        <br>
        `
      ),
      $("<p class='createdAt'>").text(moment(new Date()).format("lll")),
      $("<hr/>")
    );
   });

  $("#btnSendFile").click(function() {
    console.log("click send File");
    console.log(data);
    readThenSendFile(data);
  });

  $("#inputFile").change(function(e) {
    console.log("onChange=", e.target.files);
    data = e.target.files[0];
    $("#inputChat").val(e.target.files[0].name);
  });

  $("#btnSendChat").click(function(e) {
    e.preventDefault();
    if ($("#inputChat").val()) {
      socket.emit("chat", $("#inputChat").val());
      $("#inputChat").val("");
    }

    if (data) {
      readThenSendFile(data);
    }
  });

  $("#formChat").submit(function(e) {
    e.preventDefault();
    if ($("#inputChat").val()) {
      socket.emit("chat", $("#inputChat").val());
      $("#inputChat").val("");
    }

    if (data) {
      readThenSendFile(data);
    }
  });

  checkLogin();
});
