const host = `localhost`;

const showThis = (selector) => {
  const form = document.querySelector(selector);
  form.style.display = "flex";
};

const hideThis = (selector) => {
  const form = document.querySelector(selector);
  form.style.display = "none";
};

const indexLoad = () => {
  window.localStorage.removeItem("loginUser");
  window.localStorage.removeItem("customerEmail");
};

// Toggle Forms
$(".placeOrderButton").click(function (e) {
  e.preventDefault();
  if ($(".placeOrderForm").attr("data-opened") == "False") {
    $(".placeOrderForm").addClass("activeForm");
    $(".loginForm").removeClass("activeForm");
    $(".contentImage").addClass("display-none");
    $(".placeOrderForm").attr("data-opened", "True");
    $(".loginForm").attr("data-opened", "False");
  } else {
    $(".placeOrderForm").removeClass("activeForm");
    $(".placeOrderForm").attr("data-opened", "False");
    $(".contentImage").removeClass("display-none");
  }
});

$(".loginButton").click(function (e) {
  e.preventDefault();
  if ($(".loginForm").attr("data-opened") == "False") {
    $(".loginForm").addClass("activeForm");
    $(".placeOrderForm").removeClass("activeForm");
    $(".contentImage").addClass("display-none");
    $(".loginForm").attr("data-opened", "True");
    $(".placeOrderForm").attr("data-opened", "False");
  } else {
    $(".loginForm").removeClass("activeForm");
    $(".loginForm").attr("data-opened", "False");
    $(".contentImage").removeClass("display-none");
  }
});

// placeOrder
const placeOrder = () => {
  const formData = new FormData();
  var file = document.getElementById("orderFiles").files;
  var customerName = document.getElementById("customerName").value;

  var customerEmail = document.getElementById("customerEmail").value;

  var customerPhoneNumber = phoneInput.getNumber();

  var orderService = document.getElementById("orderService").value;

  var orderInstructions = document.getElementById("orderInstructions").value;
  formData.set("customerName", customerName);
  formData.set("customerEmail", customerEmail.toLowerCase());
  formData.set("customerPhoneNumber", customerPhoneNumber);
  formData.set("orderService", orderService);
  formData.set("orderInstructions", orderInstructions);
  formData.set("orderFiles", $(".orderFileNames").val());
  if (
    !validateInput(
      "customerName customerEmail customerPhoneNumber orderService orderFiles"
    )
  ) {
    return;
  }
  fetch(`http://${host}:8001/customer/create`, {
      method: "POST",
      body: formData,
    })
    .then(function (response) {
      var tempObject = response.json();
      tempObject.status = 200;
      if (response.status == 400) {
        const err =
          "<p class='text-white'>User Already Exists. Try Signing In</p>";
        document.getElementById("userAlreadyAuth").innerHTML = err;
        $(".loginForm").addClass("activeForm");
        $(".placeOrderForm").removeClass("activeForm");
      } else if (response.status == 403) {
        tempObject.status = 403;
        const passwordSection = document.getElementById("passwordSetSection");
        $(".passwordSetHeading").text("Account Already Exists");
        passwordSection.style.display = "flex";
        $(".iti").addClass("display-none");
      }
      return tempObject;
    })
    .then(function (data) {
      if (data.error) {
        window.localStorage.setItem(
          "customerEmail",
          data.customer.customerEmail
        );
      } else {
        window.localStorage.setItem(
          "customerEmail",
          data.customer.customerEmail
        );
        const passwordSection = document.getElementById("passwordSetSection");
        passwordSection.style.display = "flex";
        $(".iti").addClass("display-none");
      }
    });
};

const loginCustomer = () => {
  document.getElementById("userAlreadyAuth").innerHTML = "";
  var customerLoginEmail = document.getElementById("customerLoginEmail").value;
  var customerLoginPassword = document.getElementById(
    "customerLoginPassword"
  ).value;

  fetch(`http://${host}:8001/customer/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        customerEmail: customerLoginEmail,
        customerPassword: customerLoginPassword,
      }),
    })
    .then(function (response) {
      var tempObject = response.json();
      tempObject.status = 200;
      if (response.status == 400) {
        const err = "<p class='text-white'>Invalid Credentials</p>";
        document.getElementById("errorAuth").innerHTML = err;
        throw new Error("Invalid Credentials");
      } else if (response.status == 403) {
        tempObject.status = 403;
        const passwordSection = document.getElementById("passwordSetSection");
        $(".passwordSetHeading").text("You Haven't Set a Password Yet");
        passwordSection.style.display = "flex";
        $(".iti").addClass("display-none");
      }
      return tempObject;
    })
    .then((data) => {
      if (data.error) {
        window.localStorage.setItem(
          "customerEmail",
          data.customer.customerEmail
        );
      } else {
        window.localStorage.setItem(
          "customerEmail",
          data.customer.customerEmail
        );
        window.localStorage.setItem("loginUser", JSON.stringify(data.customer));
        window.location.assign(
          `http://${host}:8001/pages/customerDashboard.html`
        );
      }
    });
};

const loadReviews = () => {
  fetch(`http://${host}:8001/review/getHighlightedReviews`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const ourReviews = data.reviewsArray.map(function (review) {
        return review;
      });
      // $(".owl-carousel").html("");
      ourReviews.forEach((review) => {
        const html = `<div class="item">
        <div class="card">
          <div class="card-body">
            <img src="assets/star.png" width="20px" alt="" />
            <p class="cardPara">
              ${review.customerReview}
            </p>
            <p class="cardName"><i>- ${review.customerName}</i> (${review.highlightedDate})</p>
          </div>
        </div>
      </div>`;
        $(".owl-carousel")
          .owlCarousel()
          .trigger("add.owl.carousel", [jQuery(html)])
          .trigger("refresh.owl.carousel");
      });
    });
};

const setPassword = () => {
  var customerPassword = document.getElementById("customerPassword").value;
  var customerEmail = window.localStorage.getItem("customerEmail");
  fetch(`http://${host}:8001/customer/setPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        customerEmail: customerEmail,
        customerPassword: customerPassword,
      }),
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      window.localStorage.setItem("loginUser", JSON.stringify(data.customer));
      window.location.assign(
        `http://${host}:8001/pages/customerDashboard.html`
      );
    });
};

const validateInput = (input) => {
  const inputArray = input.split(" ");
  var allGood = true;
  inputArray.forEach((input) => {
    if (input == "customerEmail") {
      if (!ValidateEmail(document.getElementById(input).value)) {
        document.getElementById(input).style.backgroundColor = "#ffcccb";
        $(`#${input}`).addClass("white-placeholder");
        allGood = false;
      } else {
        document.getElementById(input).style.backgroundColor = "white";
        $(`#${input}`).removeClass("white-placeholder");
      }
    } else if (input == "customerPhoneNumber") {
      if (!validatePhoneNumber(document.getElementById(input).value)) {
        document.getElementById(input).style.backgroundColor = "#ffcccb";
        $(`#${input}`).addClass("white-placeholder");
        allGood = false;
      } else {
        document.getElementById(input).style.backgroundColor = "white";
        $(`#${input}`).removeClass("white-placeholder");
      }
    } else if (!document.getElementById(input).value) {
      document.getElementById(input).style.backgroundColor = "#ffcccb";
      $(`#${input}`).addClass("white-placeholder");
      allGood = false;
    } else {
      document.getElementById(input).style.backgroundColor = "white";
      $(`#${input}`).removeClass("white-placeholder");
    }
  });
  return allGood;
};

const forgotPassword = () => {
  $(".forgotPasswordMessage").addClass("display-none");

  var forgotPasswordEmail = document.getElementById(
    "forgotPasswordCustomerEmail"
  );
  var forgotPasswordCustomerOtp = document.getElementById(
    "forgotPasswordCustomerOtp"
  );
  var forgotPasswordNewPassword = document.getElementById(
    "forgotPasswordNewPassword"
  );
  if (
    forgotPasswordCustomerOtp.disabled &&
    forgotPasswordNewPassword.disabled
  ) {
    forgotPasswordSendEmail();
    return;
  } else if (
    !forgotPasswordCustomerOtp.disabled &&
    forgotPasswordNewPassword.disabled
  ) {
    forgotPasswordSendOtp();
  } else if (
    forgotPasswordCustomerOtp.disabled &&
    !forgotPasswordNewPassword.disabled
  ) {
    forgotPasswordSendPassword();
  }
};

const forgotPasswordSendEmail = () => {
  fetch(`http://${host}:8001/customer/forgotPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        customerEmail: $("#forgotPasswordCustomerEmail").val(),
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
        window.localStorage.setItem(
          "customerEmail",
          data.customer.customerEmail
        );
      } else {
        $(".forgotPasswordMessage").text(
          "An OTP has been sent to your email Id"
        );
        $(".forgotPasswordMessage").removeClass("display-none");
        $("#forgotPasswordCustomerOtp").removeClass("display-none");
        $("#forgotPasswordCustomerOtp").attr("disabled", false);
        $("#forgotPasswordCustomerEmail").attr("disabled", true);
        $("#forgotPasswordCustomerEmail").css("cursor", "not-allowed");
        $("#forgotPasswordButton").text("Submit OTP");
      }
    });
};

const forgotPasswordSendOtp = () => {
  fetch(`http://${host}:8001/customer/checkOtp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        customerEmail: $("#forgotPasswordCustomerEmail").val(),
        otp: $("#forgotPasswordCustomerOtp").val(),
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
      $("#forgotPasswordCustomerOtp").attr("disabled", true);
      $("#forgotPasswordCustomerOtp").css("cursor", "not-allowed");
      $("#forgotPasswordNewPassword").attr("disabled", false);
    });
};

const forgotPasswordSendPassword = () => {
  fetch(`http://${host}:8001/customer/newPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        customerEmail: $("#forgotPasswordCustomerEmail").val(),
        otp: $("#forgotPasswordCustomerOtp").val(),
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

const uploadFiles = () => {
  var file = document.getElementById("orderFiles").files;
  var formData = new FormData();
  for (let index = 0; index < file.length; index++) {
    formData.append("uploadedFiles", file[index]);
  }
  $.ajax({
    url: `http://${host}:8001/order/uploadFile`, //Server script to process data
    type: "POST",
    data: formData,
    contentType: false,
    processData: false,
    //Ajax events
    success: function (html) {
      var fileName = "";
      html.forEach((file) => {
        fileName = fileName + `${file.filename},`;
      });
      $(".orderFileNames").val(fileName);
      $(".placeOrderSubmitButton").removeClass("disabledButton");
      $(".placeOrderSubmitButton").attr("disabled", false);
    },
  });
};

// Owl Carousal for Reviews

$(".owl-carousel").owlCarousel({
  loop: true,
  margin: 30,
  autoplay: true,
  autoplayTimeout: 3000,
  dots: false,
  nav: true,
  responsive: {
    0: {
      items: 1,
    },
    600: {
      items: 3,
    },
    1000: {
      items: 3,
    },
  },
});