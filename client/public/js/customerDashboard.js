const host = "https://prokatib.onrender.com";

const loadDetails = () => {
  var loginCustomer = JSON.parse(window.localStorage.getItem("loginUser"));
  if (!loginCustomer) {
    window.open(`${host}/index.html`, "_self");
  }

  $(".customerDashboardHeading").html(
    `Welcome ${loginCustomer.customerName}!!</br><span style="font-size:1.5rem">Your Customer Id: ${loginCustomer._id}</span>`
  );
  fetch(`${host}/customer/getLiveOrders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        customerEmail: loginCustomer.customerEmail,
      }),
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (!data.liveOrdersArray.length) {
        $(".customerOrderId").addClass("text-danger mt-3");
        $(".customerOrderId").text(
          `(You currently don't have any live orders.)`
        );
        fetch(`${host}/customer/getPreviousOrders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              customerEmail: loginCustomer.customerEmail,
            }),
          })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            if (
              data.previousOrdersArray.length &&
              !data.previousOrdersArray.slice(-1)[0].orderReview
            ) {
              const previousOrder = data.previousOrdersArray.slice(-1)[0];
              const html = `<div class="previousOrderReviewDiv">
            <h5 class="text-primary mt-5">Review Your Previous Order: <br>Order Id: ${previousOrder._id}</h5>
            <textarea name="previousOrderReview" class="${previousOrder._id}-previousOrderReviewTextArea previousOrderReviewTextArea" placeholder="Review Your Previous Order" id="${previousOrder._id}-previousOrderReviewTextArea" rows="5"></textarea>
            <div class=PreviousOrderReviewButtonDiv>
            <button class="btn btn-success " onclick="createPreviousOrderReview('${previousOrder._id}')">Submit Review</button>
          </div>
          </div>`;
              const contentRight = document.querySelector(".cd-contentRight");
              contentRight.insertAdjacentHTML("beforeend", html);
            }
          });
        return;
      }
      $(".cd-processList").removeClass("display-none");
      fetch(`${host}/order/getOrderDetails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            orderId: data.liveOrdersArray.slice(-1),
          }),
        })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const order = data.order;
          $(".customerOrderId").text(`(ref: ${order._id})`);
          if (order.profileCompleted) {
            $(".cd-process1 i").addClass("bi bi-check-lg");
            $(".cd-process1").addClass("text-success");
          } else {
            $(".cd-process1 i").addClass("bi bi-hourglass-split");
            $(".cd-process1").addClass("text-primary");
          }
          if (order.orderFiles.length != 0) {
            $(".cd-process2 i").addClass("bi bi-check-lg");
            $(".cd-process2").addClass("text-success");
          } else {
            $(".cd-process2 i").addClass("bi bi-hourglass-split");
            $(".cd-process2").addClass("text-primary");
          }
          if (order.payment) {
            $(".cd-process3 i").addClass("bi bi-check-lg");
            $(".cd-process3").addClass("text-success");
          } else {
            $(".cd-process3 i").addClass("bi bi-hourglass-split");
            $(".cd-process3").addClass("text-primary");
          }
          if (order.completed) {
            $(".cd-process4 i").addClass("bi bi-check-lg");
            $(".cd-process4").addClass("text-success");
          } else {
            $(".cd-process4 i").addClass("bi bi-hourglass-split");
            $(".cd-process4").addClass("text-primary");
          }
        });
    });
};

const submitNewWork = () => {
  const formData = new FormData();
  var files = document.getElementById("orderFiles").files;
  var loginCustomer = JSON.parse(window.localStorage.getItem("loginUser"));
  var customerEmail = loginCustomer.customerEmail;
  var orderService = document.getElementById("orderService").value;
  var orderInstructions = document.getElementById("orderInstructions").value;
  formData.set("customerEmail", customerEmail);
  formData.set("orderService", orderService);
  formData.set("orderInstructions", orderInstructions);
  formData.set("orderFiles", $(".orderFileNames").val());
  if (!validateInput("orderService orderFiles")) {
    return;
  }
  fetch(`${host}/order/create`, {
      method: "POST",
      body: formData,
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      window.localStorage.setItem("loginUser", JSON.stringify(data.customer));
      window.location.reload();
    });
};

const showThis = (selector) => {
  const form = document.querySelector(selector);
  form.style.display = "flex";
};

const hideThis = (selector) => {
  const form = document.querySelector(selector);
  form.style.display = "none";
};

const loadLiveOrders = () => {
  var h = document.querySelector(".liveOrderContentRow");
  h.innerHTML = "";
  var loginCustomer = JSON.parse(window.localStorage.getItem("loginUser"));
  fetch(`${host}/customer/getLiveOrders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        customerEmail: loginCustomer.customerEmail,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const ourOrders = data.liveOrdersArray.map(function (order) {
        return order;
      });
      // $(".owl-carousel").html("");
      ourOrders.forEach((order) => {
        const html = `<div class="liveOrder text-wrap col-lg-4 col-md-5 col-sm-11">
        <h5 class="text-break">Order Id: <span class="text-primary text-break">${order._id}</span></h5>
        <ul class="cd-processList mt-4">
          <li class="cd-process cd-process${order._id}1 mb-4 mt-2">
            Profile Created
            <i></i>
          </li>
          <li class="cd-process cd-process${order._id}2 mb-4 mt-2">
            File Uploaded
            <i></i>
          </li>
          <li class="cd-process cd-process${order._id}3 mb-4 mt-2">
            Payment <i></i>
          </li>
          <li class="cd-process cd-process${order._id}4 mb-4 mt-2">
            Time To Complete <i></i>
          </li>
        </ul>
      </div>`;
        var h = document.querySelector(".liveOrderContentRow");
        h.insertAdjacentHTML("afterbegin", html);
        if (order.profileCompleted) {
          $(`.cd-process${order._id}1 i`).addClass("bi bi-check-lg");
          $(`.cd-process${order._id}1`).addClass("text-success");
        } else {
          $(`.cd-process${order._id}1 i`).addClass("bi bi-hourglass-split");
          $(`.cd-process${order._id}1`).addClass("text-primary");
        }
        if (order.orderFiles.length != 0) {
          $(`.cd-process${order._id}2 i`).addClass("bi bi-check-lg");
          $(`.cd-process${order._id}2`).addClass("text-success");
        } else {
          $(`.cd-process${order._id}2 i`).addClass("bi bi-hourglass-split");
          $(`.cd-process${order._id}2`).addClass("text-primary");
        }
        if (order.payment) {
          $(`.cd-process${order._id}3 i`).addClass("bi bi-check-lg");
          $(`.cd-process${order._id}3`).addClass("text-success");
        } else {
          $(`.cd-process${order._id}3 i`).addClass("bi bi-hourglass-split");
          $(`.cd-process${order._id}3`).addClass("text-primary");
        }
        if (order.completed) {
          $(`.cd-process${order._id}4 i`).addClass("bi bi-check-lg");
          $(`.cd-process${order._id}4`).addClass("text-success");
        } else {
          $(`.cd-process${order._id}4 i`).addClass("bi bi-hourglass-split");
          $(`.cd-process${order._id}4`).addClass("text-primary");
        }
      });
    });
};

const loadPreviousOrders = () => {
  var h = document.querySelector(".previousOrderContentRow");
  h.innerHTML = "";
  var loginCustomer = JSON.parse(window.localStorage.getItem("loginUser"));
  fetch(`${host}/customer/getPreviousOrders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        customerEmail: loginCustomer.customerEmail,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const ourOrders = data.previousOrdersArray.map(function (order) {
        return order;
      });
      // $(".owl-carousel").html("");
      ourOrders.forEach((order) => {
        if (order.orderReview) {
          var reviewDiv = `<p class="text-success fw-bold"><i class="bi-check-lg"></i> Reviewed</p>`;
        } else {
          var reviewDiv = `<h5 class="text-danger">Give Review: </h5><textarea id="${order._id}-createOrderReview" class="mt-3" cols="20" row="3" placeholder="What would You Like to Say about the service?" padding="1rem"></textarea>
          <button onclick="createOrderReview('${order._id}')" class="btn btn-primary my-2" type="button">Submit Review</button>`;
        }
        const html = `<div class="previousOrder text-wrap col-lg-4 col-md-5 col-sm-11">
        <h5 class="text-break">Order Id: <span class="text-primary text-break">${order._id}</span></h5>
        <ul class="cd-processList mt-4">
          <li class="cd-process cd-process${order._id}1 mb-4 mt-2">
            Profile Created
            <i></i>
          </li>
          <li class="cd-process cd-process${order._id}2 mb-4 mt-2">
            File Uploaded
            <i></i>
          </li>
          <li class="cd-process cd-process${order._id}3 mb-4 mt-2">
            Payment <i></i>
          </li>
          <li class="cd-process cd-process${order._id}4 mb-4 mt-2">
            Time To Complete <i></i>
          </li>
        </ul>
        <div class="reviewDiv">${reviewDiv}</div>
        
        
      </div>`;
        var h = document.querySelector(".previousOrderContentRow");
        h.insertAdjacentHTML("afterbegin", html);
        if (order.profileCompleted) {
          $(`.cd-process${order._id}1 i`).addClass("bi bi-check-lg");
          $(`.cd-process${order._id}1`).addClass("text-success");
        } else {
          $(`.cd-process${order._id}1 i`).addClass("bi bi-hourglass-split");
          $(`.cd-process${order._id}1`).addClass("text-primary");
        }
        if (order.orderFiles.length != 0) {
          $(`.cd-process${order._id}2 i`).addClass("bi bi-check-lg");
          $(`.cd-process${order._id}2`).addClass("text-success");
        } else {
          $(`.cd-process${order._id}2 i`).addClass("bi bi-hourglass-split");
          $(`.cd-process${order._id}2`).addClass("text-primary");
        }
        if (order.payment) {
          $(`.cd-process${order._id}3 i`).addClass("bi bi-check-lg");
          $(`.cd-process${order._id}3`).addClass("text-success");
        } else {
          $(`.cd-process${order._id}3 i`).addClass("bi bi-hourglass-split");
          $(`.cd-process${order._id}3`).addClass("text-primary");
        }
        if (order.completed) {
          $(`.cd-process${order._id}4 i`).addClass("bi bi-check-lg");
          $(`.cd-process${order._id}4`).addClass("text-success");
        } else {
          $(`.cd-process${order._id}4 i`).addClass("bi bi-hourglass-split");
          $(`.cd-process${order._id}4`).addClass("text-primary");
        }
      });
    });
};

const loadCancelledOrders = () => {
  var h = document.querySelector(".cancelledOrderContentRow");
  h.innerHTML = "";
  var loginCustomer = JSON.parse(window.localStorage.getItem("loginUser"));
  fetch(`${host}/customer/getCancelledOrders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        customerEmail: loginCustomer.customerEmail,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const ourOrders = data.cancelledOrdersArray.map(function (order) {
        return order;
      });
      // $(".owl-carousel").html("");
      ourOrders.forEach((order) => {
        if (order.payment && !order.isRefunded) {
          var reviewDiv = `<p class="text-warning fw-bold">Refund Pending</p>`;
        } else if (order.payment && order.isRefunded) {
          var reviewDiv = `<p class="text-success fw-bold"><i class="bi-check-lg"></i> Refunded</p>`;
        } else {
          var reviewDiv = `<p class="text-danger fw-bold">Refund Not Applicable</p>`;
        }
        const html = `<div class="cancelledOrder text-wrap col-lg-4 col-md-5 col-sm-11">
        <h5 class="text-break">Order Id: <span class="text-primary text-break">${order._id}</span></h5>
        <ul class="cd-processList mt-4">
          <li class="cd-process cd-process${order._id}1 mb-4 mt-2">
            Profile Created
            <i></i>
          </li>
          <li class="cd-process cd-process${order._id}2 mb-4 mt-2">
            File Uploaded
            <i></i>
          </li>
          <li class="cd-process cd-process${order._id}3 mb-4 mt-2">
            Payment <i></i>
          </li>
          <li class="cd-process cd-process${order._id}4 mb-4 mt-2">
            Time To Complete <i></i>
          </li>
        </ul>
        <div class="reviewDiv">${reviewDiv}</div>
        
        
      </div>`;
        var h = document.querySelector(".cancelledOrderContentRow");
        h.insertAdjacentHTML("afterbegin", html);
        if (order.profileCompleted) {
          $(`.cd-process${order._id}1 i`).addClass("bi bi-check-lg");
          $(`.cd-process${order._id}1`).addClass("text-success");
        } else {
          $(`.cd-process${order._id}1 i`).addClass("bi bi-hourglass-split");
          $(`.cd-process${order._id}1`).addClass("text-primary");
        }
        if (order.orderFiles.length != 0) {
          $(`.cd-process${order._id}2 i`).addClass("bi bi-check-lg");
          $(`.cd-process${order._id}2`).addClass("text-success");
        } else {
          $(`.cd-process${order._id}2 i`).addClass("bi bi-hourglass-split");
          $(`.cd-process${order._id}2`).addClass("text-primary");
        }
        if (order.payment) {
          $(`.cd-process${order._id}3 i`).addClass("bi bi-check-lg");
          $(`.cd-process${order._id}3`).addClass("text-success");
        } else {
          $(`.cd-process${order._id}3 i`).addClass("bi bi-hourglass-split");
          $(`.cd-process${order._id}3`).addClass("text-primary");
        }
        if (order.completed) {
          $(`.cd-process${order._id}4 i`).addClass("bi bi-check-lg");
          $(`.cd-process${order._id}4`).addClass("text-success");
        } else {
          $(`.cd-process${order._id}4 i`).addClass("bi bi-hourglass-split");
          $(`.cd-process${order._id}4`).addClass("text-primary");
        }
      });
    });
};

const createOrderReview = (orderId) => {
  if (!document.getElementById(`${orderId}-createOrderReview`).value) {
    document.getElementById(
      `${orderId}-createOrderReview`
    ).style.backgroundColor = "#ffcccb";
    return;
  }
  document.getElementById(
    `${orderId}-createOrderReview`
  ).style.backgroundColor = "transparent";
  var loginCustomer = JSON.parse(window.localStorage.getItem("loginUser"));
  fetch(`${host}/review/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        customerName: loginCustomer.customerName,
        customerReview: document.getElementById(`${orderId}-createOrderReview`)
          .value,
        orderId: orderId,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      $(".reviewDiv").html(
        `<p class="text-success fw-bold"><i class="bi-check-lg"></i> Reviewed</p>`
      );
    });
};

const createPreviousOrderReview = (orderId) => {
  if (
    !document.getElementById(`${orderId}-previousOrderReviewTextArea`).value
  ) {
    document.getElementById(
      `${orderId}-previousOrderReviewTextArea`
    ).style.backgroundColor = "#ffcccb";
    return;
  }
  document.getElementById(
    `${orderId}-previousOrderReviewTextArea`
  ).style.backgroundColor = "transparent";
  var loginCustomer = JSON.parse(window.localStorage.getItem("loginUser"));
  fetch(`${host}/review/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        customerName: loginCustomer.customerName,
        customerReview: document.getElementById(
          `${orderId}-previousOrderReviewTextArea`
        ).value,
        orderId: orderId,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      $(".previousOrderReviewTextArea").attr("disabled", true);
      $(".PreviousOrderReviewButtonDiv").html(
        `<p class="text-success fw-bold"><i class="bi-check-lg"></i> Reviewed</p>`
      );
    });
};

const uploadFilesFromDashboard = () => {
  var file = document.getElementById("orderFiles").files;
  var formData = new FormData();
  for (let index = 0; index < file.length; index++) {
    formData.append("uploadedFiles", file[index]);
  }
  $.ajax({
    url: `${host}/order/uploadFile`, //Server script to process data
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
      $(".submitNewWorkButton").removeClass("disabledButton");
      $(".submitNewWorkButton").attr("disabled", false);
    },
  });
};

const openChatBox = () => {
  $(".freechat-popup").addClass("freechat-popup-show");
};

const logout = () => {
  window.location.assign(`${host}/index.html`);
};

const updateCustomerEmail = () => {
  var loginCustomer = JSON.parse(window.localStorage.getItem("loginUser"));
  const newCustomerEmail = document.getElementById("updateEmailInput").value;
  if (!validateInput("updateEmailInput")) {
    return;
  }
  fetch(`${host}/customer/updateCustomerEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        customerEmail: loginCustomer.customerEmail,
        newCustomerEmail: newCustomerEmail,
      }),
    })
    .then(function (response) {
      if (response.status != 200) {
        alert("Email Can't be updated");
        throw Error;
      }
      return response.json();
    })
    .then((data) => {
      alert("Email Updated. You will now be logged out.");
      logout();
    });
};

const updateCustomerPhoneNumber = () => {
  var loginCustomer = JSON.parse(window.localStorage.getItem("loginUser"));
  const newCustomerPhoneNumber = phoneInput.getNumber();
  console.log(newCustomerPhoneNumber);
  if (!validateInput("updatePhoneNumberInput")) {
    return;
  }
  fetch(`${host}/customer/updateCustomerPhoneNumber`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        customerEmail: loginCustomer.customerEmail,
        newCustomerPhoneNumber: newCustomerPhoneNumber,
      }),
    })
    .then(function (response) {
      if (response.status != 200) {
        alert("PhoneNumber Can't be updated");
        throw Error;
      }
      return response.json();
    })
    .then((data) => {
      alert("PhoneNumber Updated. You will now be logged out.");
    });
};

const validateInput = (input) => {
  const inputArray = input.split(" ");
  var allGood = true;
  inputArray.forEach((input) => {
    if (input == "updateEmailInput") {
      if (!ValidateEmail(document.getElementById(input).value)) {
        document.getElementById(input).style.backgroundColor = "#ffcccb";
        $(`#${input}`).addClass("white-placeholder");
        allGood = false;
      } else {
        document.getElementById(input).style.backgroundColor = "white";
        $(`#${input}`).removeClass("white-placeholder");
      }
    } else if (input == "updatePhoneNumberInput") {
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