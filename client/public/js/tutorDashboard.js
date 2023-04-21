const host = "localhost";

const showThis = (selector) => {
  const form = document.querySelector(selector);
  form.style.display = "flex";
};

const hideThis = (selector) => {
  const form = document.querySelector(selector);
  form.style.display = "none";
};

const loadDetails = () => {
  var loginTutor = JSON.parse(window.localStorage.getItem("loginTutor"));
  if (!loginTutor) {
    window.open(`http://${host}:8001/tutor.html`, "_self");
  }
  fetch(`http://${host}:8001/tutor/getTutorDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        tutorEmail: loginTutor.tutorEmail,
      }),
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      window.localStorage.setItem("loginTutor", JSON.stringify(data.tutor));
    });
  loginTutor = JSON.parse(window.localStorage.getItem("loginTutor"));

  $(".tutorDashboardHeading").html(
    `Welcome Tutor - ${loginTutor.tutorName}!!</br><span style="font-size:1.5rem">Your Tutor Id: ${loginTutor._id}</span>`
  );
  if (loginTutor.isApproved) {
    $(".tutorDashboardSection").removeClass("display-none");
  } else {
    $(".tutorNotApprovedSection").removeClass("display-none");
  }
};

const loadLiveProjectBids = () => {
  var h = document.querySelector(".liveProjectBidsBody");
  h.innerHTML = "";
  fetch(`http://${host}:8001/order/getLiveProjectBids`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if ($(".liveProjectBidsCategories").val() == "all") {
        orderArray = data.orderArray;
      } else {
        orderArray = data.orderArray.filter(
          (order) => order.orderService == $(".liveProjectBidsCategories").val()
        );
      }
      if ($(".liveProjectBidsSearchBarInput").val() == "") {
        if ($(".liveProjectBidsSort").val() == "latest") {
          var htmlNonAccepted = "";
          var htmlAccepted = "";
          orderArray.forEach((order) => {
            if (!order.tutorAssigned) {
              var acceptButton = `<button class="btn btn-success ${order._id}-acceptButton" id="${order._id}-acceptButton" onclick="acceptOrder('${order._id}')">Accept</button>`;
              htmlNonAccepted =
                htmlNonAccepted +
                `<tr>
        <th scope="row" class="${order._id}-orderTitle orderTitle" onclick="showThis('.liveProjectDetailSection');loadLiveProjectDetails('${order._id}')">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>
        <td>${acceptButton}</td>
      </tr>`;
            } else {
              var acceptButton = `<button class="btn btn-dark ${order._id}-acceptButton" disabled id="${order._id}-acceptButton")">Accepted</button>`;
              htmlAccepted =
                htmlAccepted +
                `<tr>
        <th scope="row">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
            }
          });
          var html = htmlNonAccepted + htmlAccepted;
          h.insertAdjacentHTML("afterbegin", html);
        } else if ($(".liveProjectBidsSort").val() == "budgetLowToHigh") {
          var htmlNonAccepted = "";
          var htmlAccepted = "";
          orderArray.sort(function (a, b) {
            var keyA = Number(a.orderBudget);
            var keyB = Number(b.orderBudget);
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
          orderArray.forEach((order) => {
            if (!order.tutorAssigned) {
              var acceptButton = `<button class="btn btn-success ${order._id}-acceptButton" id="${order._id}-acceptButton" onclick="acceptOrder('${order._id}')">Accept</button>`;
              htmlNonAccepted =
                htmlNonAccepted +
                `<tr>
        <th scope="row" class="${order._id}-orderTitle orderTitle" onclick="showThis('.liveProjectDetailSection');loadLiveProjectDetails('${order._id}')">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
            } else {
              var acceptButton = `<button class="btn btn-dark ${order._id}-acceptButton" disabled id="${order._id}-acceptButton")">Accepted</button>`;
              htmlAccepted =
                htmlAccepted +
                `<tr>
        <th scope="row">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
            }
          });
          var html = htmlNonAccepted + htmlAccepted;
          h.insertAdjacentHTML("afterbegin", html);
        } else if ($(".liveProjectBidsSort").val() == "budgetHighToLow") {
          var htmlNonAccepted = "";
          var htmlAccepted = "";
          orderArray.sort(function (a, b) {
            var keyA = Number(a.orderBudget);
            var keyB = Number(b.orderBudget);
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });
          orderArray.forEach((order) => {
            if (!order.tutorAssigned) {
              var acceptButton = `<button class="btn btn-success ${order._id}-acceptButton" id="${order._id}-acceptButton" onclick="acceptOrder('${order._id}')">Accept</button>`;
              htmlNonAccepted =
                htmlNonAccepted +
                `<tr>
        <th scope="row" class="${order._id}-orderTitle orderTitle" onclick="showThis('.liveProjectDetailSection');loadLiveProjectDetails('${order._id}')">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
            } else {
              var acceptButton = `<button class="btn btn-dark ${order._id}-acceptButton" disabled id="${order._id}-acceptButton")">Accepted</button>`;
              htmlAccepted =
                htmlAccepted +
                `<tr>
        <th scope="row">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
            }
          });
          var html = htmlNonAccepted + htmlAccepted;
          h.insertAdjacentHTML("afterbegin", html);
        } else if ($(".liveProjectBidsSort").val() == "durationHighToLow") {
          var htmlNonAccepted = "";
          var htmlAccepted = "";
          orderArray.sort(function (a, b) {
            var keyA = Number(a.orderDuration);
            var keyB = Number(b.orderDuration);
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });
          orderArray.forEach((order) => {
            if (!order.tutorAssigned) {
              var acceptButton = `<button class="btn btn-success ${order._id}-acceptButton" id="${order._id}-acceptButton" onclick="acceptOrder('${order._id}')">Accept</button>`;
              htmlNonAccepted =
                htmlNonAccepted +
                `<tr>
        <th scope="row" class="${order._id}-orderTitle orderTitle" onclick="showThis('.liveProjectDetailSection');loadLiveProjectDetails('${order._id}')">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
            } else {
              var acceptButton = `<button class="btn btn-dark ${order._id}-acceptButton" disabled id="${order._id}-acceptButton")">Accepted</button>`;
              htmlAccepted =
                htmlAccepted +
                `<tr>
        <th scope="row">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
            }
          });
          var html = htmlNonAccepted + htmlAccepted;
          h.insertAdjacentHTML("afterbegin", html);
        } else if ($(".liveProjectBidsSort").val() == "durationLowToHigh") {
          var htmlNonAccepted = "";
          var htmlAccepted = "";
          orderArray.sort(function (a, b) {
            var keyA = Number(a.orderDuration);
            var keyB = Number(b.orderDuration);
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
          orderArray.forEach((order) => {
            if (!order.tutorAssigned) {
              var acceptButton = `<button class="btn btn-success ${order._id}-acceptButton" id="${order._id}-acceptButton" onclick="acceptOrder('${order._id}')">Accept</button>`;
              htmlNonAccepted =
                htmlNonAccepted +
                `<tr>
        <th scope="row" class="${order._id}-orderTitle orderTitle" onclick="showThis('.liveProjectDetailSection');loadLiveProjectDetails('${order._id}')">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
            } else {
              var acceptButton = `<button class="btn btn-dark ${order._id}-acceptButton" disabled id="${order._id}-acceptButton")">Accepted</button>`;
              htmlAccepted =
                htmlAccepted +
                `<tr>
        <th scope="row">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
            }
          });
          var html = htmlNonAccepted + htmlAccepted;
          h.insertAdjacentHTML("afterbegin", html);
        }
      } else {
        const searchTerm = $(".liveProjectBidsSearchBarInput").val();
        if ($(".liveProjectBidsSort").val() == "latest") {
          var htmlNonAccepted = "";
          var htmlAccepted = "";
          orderArray.forEach((order) => {
            if (!order.tutorAssigned) {
              if (
                order.orderTitle
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions.includes(searchTerm)
              ) {
                var acceptButton = `<button class="btn btn-success ${order._id}-acceptButton" id="${order._id}-acceptButton" onclick="acceptOrder('${order._id}')">Accept</button>`;
                htmlNonAccepted =
                  htmlNonAccepted +
                  `<tr>
        <th scope="row" class="${order._id}-orderTitle orderTitle" onclick="showThis('.liveProjectDetailSection');loadLiveProjectDetails('${order._id}')">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
              }
            } else {
              if (
                order.orderTitle
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions.includes(searchTerm)
              ) {
                var acceptButton = `<button class="btn btn-dark ${order._id}-acceptButton" disabled id="${order._id}-acceptButton")">Accepted</button>`;
                htmlAccepted =
                  htmlAccepted +
                  `<tr>
        <th scope="row">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
              }
            }
          });
          var html = htmlNonAccepted + htmlAccepted;
          h.insertAdjacentHTML("afterbegin", html);
        } else if ($(".liveProjectBidsSort").val() == "budgetLowToHigh") {
          var htmlNonAccepted = "";
          var htmlAccepted = "";
          orderArray.sort(function (a, b) {
            var keyA = Number(a.orderBudget);
            var keyB = Number(b.orderBudget);
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
          orderArray.forEach((order) => {
            if (!order.tutorAssigned) {
              if (
                order.orderTitle
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
              ) {
                var acceptButton = `<button class="btn btn-success ${order._id}-acceptButton" id="${order._id}-acceptButton" onclick="acceptOrder('${order._id}')">Accept</button>`;
                htmlNonAccepted =
                  htmlNonAccepted +
                  `<tr>
        <th scope="row" class="${order._id}-orderTitle orderTitle" onclick="showThis('.liveProjectDetailSection');loadLiveProjectDetails('${order._id}')">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
              }
            } else {
              if (
                order.orderTitle
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions.includes(searchTerm)
              ) {
                var acceptButton = `<button class="btn btn-dark ${order._id}-acceptButton" disabled id="${order._id}-acceptButton")">Accepted</button>`;
                htmlAccepted =
                  htmlAccepted +
                  `<tr>
        <th scope="row">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
              }
            }
          });
          var html = htmlNonAccepted + htmlAccepted;
          h.insertAdjacentHTML("afterbegin", html);
        } else if ($(".liveProjectBidsSort").val() == "budgetHighToLow") {
          var htmlNonAccepted = "";
          var htmlAccepted = "";
          orderArray.sort(function (a, b) {
            var keyA = Number(a.orderBudget);
            var keyB = Number(b.orderBudget);
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });
          orderArray.forEach((order) => {
            if (!order.tutorAssigned) {
              if (
                order.orderTitle
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions.includes(searchTerm)
              ) {
                var acceptButton = `<button class="btn btn-success ${order._id}-acceptButton" id="${order._id}-acceptButton" onclick="acceptOrder('${order._id}')">Accept</button>`;
                htmlNonAccepted =
                  htmlNonAccepted +
                  `<tr>
        <th scope="row" class="${order._id}-orderTitle orderTitle" onclick="showThis('.liveProjectDetailSection');loadLiveProjectDetails('${order._id}')">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
              }
            } else {
              if (
                order.orderTitle
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions.includes(searchTerm)
              ) {
                var acceptButton = `<button class="btn btn-dark ${order._id}-acceptButton" disabled id="${order._id}-acceptButton")">Accepted</button>`;
                htmlAccepted =
                  htmlAccepted +
                  `<tr>
        <th scope="row">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
              }
            }
          });
          var html = htmlNonAccepted + htmlAccepted;
          h.insertAdjacentHTML("afterbegin", html);
        } else if ($(".liveProjectBidsSort").val() == "durationHighToLow") {
          var htmlNonAccepted = "";
          var htmlAccepted = "";
          orderArray.sort(function (a, b) {
            var keyA = Number(a.orderDuration);
            var keyB = Number(b.orderDuration);
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });
          orderArray.forEach((order) => {
            if (
              order.orderTitle
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
              order.orderInstructions
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
              order.orderInstructions.includes(searchTerm)
            ) {
              if (!order.tutorAssigned) {
                var acceptButton = `<button class="btn btn-success ${order._id}-acceptButton" id="${order._id}-acceptButton" onclick="acceptOrder('${order._id}')">Accept</button>`;
                htmlNonAccepted =
                  htmlNonAccepted +
                  `<tr>
        <th scope="row" class="${order._id}-orderTitle orderTitle" onclick="showThis('.liveProjectDetailSection');loadLiveProjectDetails('${order._id}')">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
              }
            } else {
              if (
                order.orderTitle
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions.includes(searchTerm)
              ) {
                var acceptButton = `<button class="btn btn-dark ${order._id}-acceptButton" disabled id="${order._id}-acceptButton")">Accepted</button>`;
                htmlAccepted =
                  htmlAccepted +
                  `<tr>
        <th scope="row">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
              }
            }
          });
          var html = htmlNonAccepted + htmlAccepted;
          h.insertAdjacentHTML("afterbegin", html);
        } else if ($(".liveProjectBidsSort").val() == "durationLowToHigh") {
          var htmlNonAccepted = "";
          var htmlAccepted = "";
          orderArray.sort(function (a, b) {
            var keyA = Number(a.orderDuration);
            var keyB = Number(b.orderDuration);
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
          orderArray.forEach((order) => {
            if (!order.tutorAssigned) {
              if (
                order.orderTitle
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions.includes(searchTerm)
              ) {
                var acceptButton = `<button class="btn btn-success ${order._id}-acceptButton" id="${order._id}-acceptButton" onclick="acceptOrder('${order._id}')">Accept</button>`;
                htmlNonAccepted =
                  htmlNonAccepted +
                  `<tr>
        <th scope="row" class="${order._id}-orderTitle orderTitle" onclick="showThis('.liveProjectDetailSection');loadLiveProjectDetails('${order._id}')">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
              }
            } else {
              if (
                order.orderTitle
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                order.orderInstructions.includes(searchTerm)
              ) {
                var acceptButton = `<button class="btn btn-dark ${order._id}-acceptButton" disabled id="${order._id}-acceptButton")">Accepted</button>`;
                htmlAccepted =
                  htmlAccepted +
                  `<tr>
        <th scope="row">
          ${order.orderTitle}
        </th>
        <td>$${order.orderBudget}</td>
        <td>${order.orderDuration} days</td>
        <td>${order.orderService}</td>

        <td>${acceptButton}</td>
      </tr>`;
              }
            }
          });
          var html = htmlNonAccepted + htmlAccepted;
          h.insertAdjacentHTML("afterbegin", html);
        }
      }
    });
};

const loadOngoingOrders = () => {
  var loginTutor = JSON.parse(window.localStorage.getItem("loginTutor"));
  var h = document.querySelector(".ongoingOrderContentRow");
  h.innerHTML = "";
  fetch(`http://${host}:8001/tutor/getTutorOngoingOrders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        tutorEmail: loginTutor._id,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const ourOrders = data.orderArray.map(function (order) {
        return order;
      });
      // $(".owl-carousel").html("");
      if (ourOrders.length > 0) {
        ourOrders.forEach((order) => {
          const html = `<div class="ongoingOrder d-flex flex-column text-break col-lg-4 col-md-7 col-sm-11">
        <h5 class="text-break text-center text-primary">${order._id}</h5>
        <h6 class="text-break text-center text-success my-2">Service: <span class="text-danger">${order.orderService}</span></h6>
        
        <h6 class="text-break  mt-2">Task: <span class="text-danger">${order.orderTitle}</span></h6>
        <h6 class="text-break  mt-2">Customer Instructions: <span class="text-danger">${order.orderInstructions}</span></h6>
        <h6 class="text-break  mt-2">Budget: <span class="text-danger">$${order.orderBudget}</span></h6>
        <h6 class="text-break  mt-2">Duration: <span class="text-danger">${order.orderDuration} Days</span></h6>
        <h6 class="text-break text-center text-success mt-4 fw-bold" role="button" onclick="downloadOrderFiles('${order._id}')"><i class="bi bi-download">  Download Files</i></h6>
        <button  class="${order._id}-rejectOrderButton btn btn-danger mt-3" onclick="rejectOrder('${order._id}')" type="button">Reject Order</button>
        <h6 class="text-center text-danger ${order._id}-rejectOrderMessage rejectedMessage display-none mt-3"><i class="bi bi-dash-circle-fill"></i> Rejected</h6>
        </div>`;
          var h = document.querySelector(".ongoingOrderContentRow");
          h.insertAdjacentHTML("afterbegin", html);
        });
      } else {
        const html = `<img class="noOrders mt-5" src="../assets/no-orders.png" alt="no-orders" width="100px">
        <h2 class="text-center mt-3 text-warning">No Ongoing Orders</h2>`;
        var h = document.querySelector(".ongoingOrderContentRow");
        h.insertAdjacentHTML("afterbegin", html);
      }
    });
};

const loadCompletedOrders = () => {
  var loginTutor = JSON.parse(window.localStorage.getItem("loginTutor"));
  var h = document.querySelector(".completedOrderContentRow");
  h.innerHTML = "";
  fetch(`http://${host}:8001/tutor/getTutorCompletedOrders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        tutorEmail: loginTutor._id,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const ourOrders = data.orderArray.map(function (order) {
        return order;
      });
      // $(".owl-carousel").html("");
      if (ourOrders.length > 0) {
        ourOrders.forEach((order) => {
          const html = `<div class="completedOrder d-flex flex-column text-break col-lg-4 col-md-7 col-sm-11">
          <h5 class="text-break text-center text-primary">${order._id}</h5>
          <h6 class="text-break text-center text-success my-2">Service: <span class="text-danger">${order.orderService}</span></h6>
          
          <h6 class="text-break  mt-2">Task: <span class="text-danger">${order.orderTitle}</span></h6>
          <h6 class="text-break  mt-2">Customer Instructions: <span class="text-danger">${order.orderInstructions}</span></h6>
          <h6 class="text-break  mt-2">Budget: <span class="text-danger">$${order.orderBudget}</span></h6>
          <h6 class="text-break  mt-2">Duration: <span class="text-danger">${order.orderDuration} Days</span></h6>
  
        </div>`;
          var h = document.querySelector(".completedOrderContentRow");
          h.insertAdjacentHTML("afterbegin", html);
        });
      } else {
        const html = `<img class="noOrders mt-5" src="../assets/no-orders.png" alt="no-orders" width="100px">
          <h2 class="text-center mt-3 text-warning">No Completed Orders</h2>`;
        var h = document.querySelector(".completedOrderContentRow");
        h.insertAdjacentHTML("afterbegin", html);
      }
    });
};

const acceptOrder = (orderId) => {
  var loginTutor = JSON.parse(window.localStorage.getItem("loginTutor"));
  fetch(`http://${host}:8001/tutor/acceptOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        tutorEmail: loginTutor.tutorEmail,
        orderId: orderId,
      }),
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      $(`#${orderId}-acceptButton`).attr("disabled", true);
      $(`#${orderId}-acceptButton`).text("Accepted");
      $(`#${orderId}-acceptButton`).removeClass("btn-success");
      $(`#${orderId}-acceptButton`).addClass("btn-dark");
      $(`#${orderId}-liveProjectDetailAcceptButton`).attr("disabled", true);
      $(`#${orderId}-liveProjectDetailAcceptButton`).text("Accepted");
      $(`#${orderId}-liveProjectDetailAcceptButton`).removeClass("btn-success");
      $(`#${orderId}-liveProjectDetailAcceptButton`).addClass("btn-dark");
    });
};

const loadLiveProjectDetails = (orderId) => {
  fetch(`http://${host}:8001/order/getOrderDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        orderId: orderId,
      }),
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      $(".liveProjectDetailTask").html(
        `<span class="text-danger">Task:</span> ${data.order.orderTitle}`
      );
      $(".liveProjectDetailBudget")
        .html(`<span class="text-danger">Budget:</span> $${data.order.orderBudget}
      `);
      $(".liveProjectDetailDuration")
        .html(`<span class="text-danger">Duration:</span> ${data.order.orderDuration} days
      `);
      $(".liveProjectDetailInstructions")
        .html(`<span class="text-danger">Customer Instructions:</span> ${data.order.orderInstructions}
      `);
      $(".liveProjectDetailAcceptButtonDiv").html(`<button
        class="btn btn-success liveProjectDetailAcceptButton fw-bold mt-5" id="${data.order._id}-liveProjectDetailAcceptButton" onclick=acceptOrder('${data.order._id}')
      >
        Accept Project
      </button>`);
      $(".liveProjectDetailDownloadButtonDiv").html(`<button
    class="btn btn-primary liveProjectDetailDownloadButton fw-bold mt-5" onclick="downloadOrderFiles('${data.order._id}')"
  >
    <i class="bi bi-download"></i> Download Files
  </button>`);
    });
};

const rejectOrder = (orderId) => {
  fetch(`http://${host}:8001/order/rejectOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        orderId: orderId,
      }),
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      $(`.${orderId}-rejectOrderButton`).addClass("display-none");
      $(`.${orderId}-rejectOrderMessage`).removeClass("display-none");
    });
};

const logout = () => {
  window.location.assign(`http://${host}:8001/tutor.html`);
};

const openChatBox = () => {
  $(".freechat-popup").addClass("freechat-popup-show");
};

const downloadOrderFiles = (orderId) => {
  window.open(`http://${host}:8001/order/downloadOrderFiles/${orderId}`);
};

const updateTutorEmail = () => {
  var loginTutor = JSON.parse(window.localStorage.getItem("loginTutor"));
  const newTutorEmail = document.getElementById("updateEmailInput").value;
  if (!validateInput("updateEmailInput")) {
    return;
  }
  fetch(`http://${host}:8001/tutor/updateTutorEmail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        tutorEmail: loginTutor.tutorEmail,
        newTutorEmail: newTutorEmail,
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

const updateTutorPhoneNumber = () => {
  var loginTutor = JSON.parse(window.localStorage.getItem("loginTutor"));
  const newTutorPhoneNumber = phoneInput.getNumber();
  console.log(newTutorPhoneNumber);
  if (!validateInput("updatePhoneNumberInput")) {
    return;
  }
  fetch(`http://${host}:8001/tutor/updateTutorPhoneNumber`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        tutorEmail: loginTutor.tutorEmail,
        newTutorPhoneNumber: newTutorPhoneNumber,
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