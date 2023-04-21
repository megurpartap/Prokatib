const host = "https://prokatib.onrender.com/";

const showThis = (selector) => {
  const form = document.querySelector(selector);
  form.style.display = "flex";
};

const hideThis = (selector) => {
  const form = document.querySelector(selector);
  form.style.display = "none";
};

const tutorLoad = () => {
  window.localStorage.removeItem("loginTutor");
};

const tutorSignUp = () => {
  document.getElementById("errorAuth").innerHTML = "";
  var tutorName = document.getElementById("tutorName").value;
  var tutorEmail = document.getElementById("tutorEmail").value;
  var tutorPhoneNumber = phoneInput.getNumber();
  var tutorCountryList = document.getElementById("tutorCountryList").value;
  var tutorStateList = document.getElementById("tutorStateList").value;
  var tutorPassword = document.getElementById("tutorPassword").value;
  var tutorConfirmPassword = document.getElementById(
    "tutorConfirmPassword"
  ).value;
  var orderService = Array();
  var checked = false;
  for (var i = 1; i < 7; i++) {
    if (document.getElementById(`btncheck${i}`).checked) {
      checked = true;
      orderService.push(
        document.getElementById(`btncheck${i}`).getAttribute("data-value")
      );
    }
  }

  var tutorDescription = document.getElementById("tutorDescription").value;
  if (
    !validateInput(
      "tutorName tutorEmail tutorPhoneNumber tutorCountryList tutorStateList"
    )
  ) {
    return;
  }
  if (!checked) {
    const err = "<p class='text-danger'>Check At Least One Field</p>";
    document.getElementById("errorAuth").innerHTML = err;
    return;
  }

  if (!tutorPassword || !tutorConfirmPassword) {
    const err = "<p class='text-danger'>Enter Your Password</p>";
    document.getElementById("errorAuth").innerHTML = err;
    return;
  } else {
    if (tutorPassword != tutorConfirmPassword) {
      const err = "<p class='text-danger'>Passwords Do Not Match</p>";
      document.getElementById("errorAuth").innerHTML = err;
      return;
    }
  }

  fetch(`http://${host}/tutor/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        tutorName: tutorName,
        tutorEmail: tutorEmail,
        tutorPhoneNumber: tutorPhoneNumber,
        tutorCountry: tutorCountryList,
        tutorState: tutorStateList,
        orderService: orderService,
        tutorDescription: tutorDescription,
        tutorPassword: tutorPassword,
      }),
    })
    .then(function (response) {
      if (response.status != 200) {
        if (response.status == 403) {
          const err =
            "<p class='text-danger'>Tutor Is Blocked From This Site.</p>";
          document.getElementById("errorAuth").innerHTML = err;
          throw Error;
        } else if (response.status == 409) {
          const err =
            "<p class='text-danger'>User Already Exists. Try Signing In</p>";
          document.getElementById("errorAuth").innerHTML = err;
          throw Error;
        }
      }
      return response.json();
    })
    .then(function (data) {
      window.localStorage.setItem("loginTutor", JSON.stringify(data.tutor));
      window.location.assign(`http://${host}/pages/tutorDashboard.html`);
    });
};

const validateInput = (input) => {
  const inputArray = input.split(" ");
  var allGood = true;
  inputArray.forEach((input) => {
    if (input == "tutorEmail") {
      if (!ValidateEmail(document.getElementById(input).value)) {
        document.getElementById(input).style.backgroundColor = "#ffcccb";
        $(`#${input}`).addClass("white-placeholder");
        allGood = false;
      } else {
        document.getElementById(input).style.backgroundColor = "transparent";
        $(`#${input}`).removeClass("white-placeholder");
      }
    } else if (input == "tutorPhoneNumber") {
      if (!validatePhoneNumber(document.getElementById(input).value)) {
        document.getElementById(input).style.backgroundColor = "#ffcccb";
        $(`#${input}`).addClass("white-placeholder");
        allGood = false;
      } else {
        document.getElementById(input).style.backgroundColor = "transparent";
        $(`#${input}`).removeClass("white-placeholder");
      }
    } else if (!document.getElementById(input).value) {
      document.getElementById(input).style.backgroundColor = "#ffcccb";
      $(`#${input}`).addClass("white-placeholder");
      allGood = false;
    } else if (input == "tutorStateList") {
      if (document.getElementById(input).style.display != "none") {
        if (!document.getElementById(input).value) {
          document.getElementById(input).style.backgroundColor = "#ffcccb";
          $(`#${input}`).addClass("white-placeholder");
          allGood = false;
        } else {
          document.getElementById(input).style.backgroundColor = "transparent";
          $(`#${input}`).removeClass("white-placeholder");
        }
      }
    } else {
      document.getElementById(input).style.backgroundColor = "transparent";
      $(`#${input}`).removeClass("white-placeholder");
    }
  });
  return allGood;
};

function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}

function validatePhoneNumber(input_str) {
  var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

  return re.test(input_str);
}

const loadLocations = () => {
  const disabledCountry = document.getElementById("disabledCountry");
  disabledCountry.setAttribute("selected", true);
  disabledCountry.innerText = "Loading Countries";
  $("#tutorCountryList").prop("disabled", true);
  fetch(`https://countriesnow.space/api/v0.1/countries/states`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var htmlList = "";
      data.data.forEach((country) => {
        htmlList =
          htmlList +
          `<option value="${country.name}">${country.name}</option>)`;
      });
      var h = document.getElementById("tutorCountryList");
      h.innerHTML = `<option value="" selected disabled id="disabledCountry">
                      Choose Your Country
                    </option>`;
      h.insertAdjacentHTML("afterbegin", htmlList);
      $("#tutorCountryList").prop("disabled", false);
    });
};

const loadStateList = () => {
  const country = document.getElementById("tutorCountryList").value;
  $("#tutorCountryList").css("background-color", "transparent");
  $("#tutorStateList").css("background-color", "transparent");
  $("#tutorStateList").removeClass("display-none");
  $("#tutorStateList").prop("disabled", true);
  const disabledState = document.getElementById("disabledState");
  disabledState.setAttribute("selected", true);
  disabledState.innerText = "Loading States";
  fetch(`https://countriesnow.space/api/v0.1/countries/states`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        country: country,
      }),
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var htmlList = "";
      if (!data.data.states.length) {
        $("#tutorStateList").addClass("display-none");
      }
      data.data.states.forEach((state) => {
        htmlList =
          htmlList + `<option value="${state.name}">${state.name}</option>)`;
      });
      var h = document.getElementById("tutorStateList");
      h.innerHTML = `<option value="" selected disabled id="disabledState">
                      Choose Your State
                    </option>`;
      h.insertAdjacentHTML("afterbegin", htmlList);
      $("#tutorStateList").prop("disabled", false);
    });
};

$("#tutorStateList").change(function (e) {
  e.preventDefault();
  $("#tutorStateList").css("background-color", "transparent");
});

const loginTutor = () => {
  document.getElementById("errAuth").innerHTML = " ";
  var tutorLoginEmail = document.getElementById("tutorLoginEmail").value;
  var tutorLoginPassword = document.getElementById("tutorLoginPassword").value;
  fetch(`http://${host}/tutor/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        tutorEmail: tutorLoginEmail,
        tutorPassword: tutorLoginPassword,
      }),
    })
    .then(function (response) {
      if (response.status == 400) {
        const err = "<p class='text-danger'>Invalid Credentials</p>";
        document.getElementById("errAuth").innerHTML = err;
        throw new Error("Invalid Credentials");
      } else if (response.status == 403) {
        const err = "<p class='text-danger'>Your Account is Blocked</p>";
        document.getElementById("errAuth").innerHTML = err;
        throw new Error("Tutor Blocked");
      } else if (response.status == 401) {
        const err =
          "<p class='text-danger text-center'>Your Account is Rejected<br>Check Your Email to Know The Reason </p>";
        document.getElementById("errAuth").innerHTML = err;
        throw new Error("Tutor Rejected");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      window.location.assign(`http://${host}/pages/tutorDashboard.html`);
      window.localStorage.setItem("loginTutor", JSON.stringify(data.tutor));
    });
};

const forgotPassword = () => {
  $(".forgotPasswordMessage").addClass("display-none");

  var forgotPasswordEmail = document.getElementById("forgotPasswordTutorEmail");
  var forgotPasswordTutorOtp = document.getElementById(
    "forgotPasswordTutorOtp"
  );
  var forgotPasswordNewPassword = document.getElementById(
    "forgotPasswordNewPassword"
  );
  if (forgotPasswordTutorOtp.disabled && forgotPasswordNewPassword.disabled) {
    forgotPasswordSendEmail();
    return;
  } else if (
    !forgotPasswordTutorOtp.disabled &&
    forgotPasswordNewPassword.disabled
  ) {
    forgotPasswordSendOtp();
  } else if (
    forgotPasswordTutorOtp.disabled &&
    !forgotPasswordNewPassword.disabled
  ) {
    forgotPasswordSendPassword();
  }
};

const forgotPasswordSendEmail = () => {
  fetch(`http://${host}/tutor/forgotPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        tutorEmail: $("#forgotPasswordTutorEmail").val(),
      }),
    })
    .then(function (response) {
      var tempObject = response.json();
      tempObject.status = 200;
      if (response.status == 400) {
        $(".forgotPasswordMessage").text("User Does Not Exist");
        $(".forgotPasswordMessage").removeClass("display-none");
        throw Error;
      } else if (response.status == 403) {
        tempObject.status = 403;
        const passwordSection = document.getElementById("passwordSetSection");
        $(".passwordSetHeading").text(
          "You haven't set a password a single time."
        );
        const forgotPasswordSection = document.getElementById(
          "forgotPasswordSection"
        );

        passwordSection.style.display = "flex";
        forgotPasswordSection.style.display = "none";
        $(".iti").addClass("display-none");
      }
      return tempObject;
    })
    .then((data) => {
      if (data.error) {
        window.localStorage.setItem("tutorEmail", data.tutor.tutorEmail);
      } else {
        $(".forgotPasswordMessage").text(
          "An OTP has been sent to your email Id"
        );
        $(".forgotPasswordMessage").removeClass("display-none");
        $("#forgotPasswordTutorOtp").removeClass("display-none");
        $("#forgotPasswordTutorOtp").attr("disabled", false);
        $("#forgotPasswordTutorEmail").attr("disabled", true);
        $("#forgotPasswordTutorEmail").css("cursor", "not-allowed");
        $("#forgotPasswordButton").text("Submit OTP");
      }
    });
};

const forgotPasswordSendOtp = () => {
  fetch(`http://${host}/tutor/checkOtp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        tutorEmail: $("#forgotPasswordTutorEmail").val(),
        otp: $("#forgotPasswordTutorOtp").val(),
      }),
    })
    .then(function (response) {
      if (response.status == 400) {
        $(".forgotPasswordMessage").text("Otp Mismatch");
        $(".forgotPasswordMessage").removeClass("display-none");
        throw Error;
      }
      return response.json();
    })
    .then((data) => {
      $(".forgotPasswordMessage").text("Enter new Password");
      $(".forgotPasswordMessage").removeClass("display-none");
      $("#forgotPasswordNewPassword").removeClass("display-none");
      $("#forgotPasswordButton").text("Reset Password");
      $("#forgotPasswordTutorOtp").attr("disabled", true);
      $("#forgotPasswordTutorOtp").css("cursor", "not-allowed");
      $("#forgotPasswordNewPassword").attr("disabled", false);
    });
};

const forgotPasswordSendPassword = () => {
  fetch(`http://${host}/tutor/newPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        tutorEmail: $("#forgotPasswordTutorEmail").val(),
        otp: $("#forgotPasswordTutorOtp").val(),
        password: $("#forgotPasswordNewPassword").val(),
      }),
    })
    .then(function (response) {
      if (response.status == 400) {
        $(".forgotPasswordMessage").text(
          "Can't Change Your Password. Try Later"
        );
        $(".forgotPasswordMessage").removeClass("display-none");
        throw Error;
      }
      return response.json();
    })
    .then((data) => {
      $(".forgotPasswordMessage").text(
        "Your Password Has Been Reset. The Page will Reload now."
      );
      $(".forgotPasswordMessage").removeClass("display-none");
      $(".forgotPasswordMessage").removeClass("text-danger");
      $(".forgotPasswordMessage").addClass("text-success");
      $("#forgotPasswordButton").addClass("display-none");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
};

function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}

function validatePhoneNumber(input_str) {
  var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

  return re.test(input_str);
}