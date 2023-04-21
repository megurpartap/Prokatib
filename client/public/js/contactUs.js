const host = "https://prokatib.onrender.com/";

const contactUs = () => {
  fetch(`http://${host}/contactUs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        contactUsName: $("#contactUsName").val(),
        contactUsEmail: $("#contactUsEmail").val(),
        contactUsMessage: $("#contactUsMessage").val(),
      }),
    })
    .then(function (response) {
      if (response.status != 200) {
        $(".contactUsSentMessage").text("Message Not Sent");
        $(".contactUsSentMessage").removeClass("display-none");
        throw Error;
      }
      return response.json();
    })
    .then((data) => {
      $(".contactUsSentMessage").text("Message Sent");
      $(".contactUsSentMessage").removeClass("display-none");
      $(".contactUsSentMessage").addClass("text-success");
      $("#contactUsName").val("");
      $("#contactUsEmail").val("");
      $("#contactUsMessage").val("");
    });
};