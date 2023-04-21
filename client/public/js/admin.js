const host = "localhost";

const showThis = (selector) => {
  const form = document.querySelector(selector);
  form.style.display = "flex";
};

const hideThis = (selector) => {
  const form = document.querySelector(selector);
  form.style.display = "none";
};

const loadNewOrders = () => {
  var h = document.querySelector(".newOrderContentRow");
  h.innerHTML = "";
  fetch(`http://${host}:8001/order/getNewOrders`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const ourOrders = data.orderArray.map(function (order) {
        return order;
      });
      if (ourOrders.length) {
        $(".newOrderOption").addClass("text-primary");
        $(".newOrderOption").html(
          `New Orders<span class="newOrderNotification bg-primary text-white px-2 mx-2 rounded-circle">${ourOrders.length}</span>`
        );
      }
      // $(".owl-carousel").html("");
      if (ourOrders.length > 0) {
        var un = document.querySelector(".newOrderUnderRow");
        var ma = document.querySelector(".newOrderMasterRow");
        var we = document.querySelector(".newOrderWebRow");
        var jo = document.querySelector(".newOrderJournalRow");
        var of = document.querySelector(".newOrderOfficialRow");
        var pr = document.querySelector(".newOrderProofRow");
        un.innerHTML =
          "<h4 class=' fw-bold text-danger'>UnderGraduate</h4><hr>";
        pr.innerHTML = "<h4 class=' fw-bold text-danger'>ProofReading</h4><hr>";
        ma.innerHTML = "<h4 class=' fw-bold text-danger'>Masters</h4><hr>";
        we.innerHTML = "<h4 class=' fw-bold text-danger'>WebSite</h4><hr>";
        jo.innerHTML = "<h4 class=' fw-bold text-danger'>Journal</h4><hr>"; of .innerHTML =
          "<h4 class=' fw-bold text-danger'>Official Letters</h4><hr>";

        ourOrders.forEach((order) => {
          const html = `<div class="newOrder d-flex flex-column text-break col-lg-4 col-md-5 col-sm-11">
        <div class="newOrderChatIcon text-success" onclick="openWhatsappChat('${
          order.customerPhoneNumber
        }')"><i class="bi bi-chat-dots-fill"></i></div>
        <h5 class="text-break text-center text-primary mt-3">${order._id}</h5>
        <h6 class="text-break text-center mt-2">Service: <span class="text-danger">${
          order.orderService
        }</span></h6>
        <h6 class="text-break text-center mt-2">Customer Email: <span class="text-danger">${
          order.customerEmail
        }</span></h6>
        <h6 class="text-break text-center mt-2">Customer Phone Number: <span class="text-danger">${
          order.customerPhoneNumber
        }</span></h6>
        <h6 class="text-break text-center mt-2">Payment Status: <span class="text-primary">${
          order.payment ? "Completed" : "Pending"
        }</span></h6>
        <ul class="ad-processList mt-4">
          <li class="ad-process mb-1 mt-2 text-success fw-bold" role="button" onclick="downloadOrderFiles('${
            order._id
          }')">
            Download Files
            <i class="bi bi-download"></i>
          </li>
          <li class="ad-process">
            Order Instructions: <p>${order.orderInstructions}</p>
            <i></i>
          </li>
        </ul>
        <select name="service" class="align-self-center" id="${
          order._id
        }-orderService" required>
              <option value="" disabled selected>Choose The Service</option>
              <option value="undergraduate">Undergraduate Work</option>
              <option value="master">Master & PhD work</option>
              <option value="proofreading">Proofreading & Plagiarism</option>
              <option value="journal">Journal Articles & Patent Drafts</option>
              <option value="officialLetters">
                Official Letters (Visa, Cover Letter, CV)
              </option>
              <option value="website">Website, Logo & Marketing</option>
            </select>
            <textarea id="${
              order._id
            }-orderTitle" class="mb-2" cols="20" rows="3" placeholder="Order Title"></textarea>
            <input type=number id="${
              order._id
            }-orderBudget" class="mb-2" placeholder="Order Budget (Enter Number)"></input>
            <input type=number id="${
              order._id
            }-orderDuration" class="mb-2" placeholder="Order Duration (Enter Number)"></input>
            <p class="${
              order._id
            }-errorMessage display-none text-center text-danger fw-bold">Choose a Service</p>
            <button onclick="approveOrder('${order._id}')" class="${
            order._id
          }-approveButton" type="button">Approve Order</button>
            <h6 class="text-center text-success ${
              order._id
            }-approveMessage approvedMessage display-none"><i class="bi bi-check-lg"></i> Approved</h6>
          <button onclick="cancelOrder('${order._id}')" class="${
            order._id
          }-cancelOrderButton btn btn-danger mt-3" type="button" >Cancel Order</button>
            <h6 class="text-center text-danger ${
              order._id
            }-cancelOrderMessage cancelledMessage display-none"><i class="bi bi-x-lg"></i> Cancelled</h6>
      </div>`;
          if (order.orderService[0] == "u") {
            un.insertAdjacentHTML("beforeend", html);
          } else if (order.orderService[0] == "m") {
            ma.insertAdjacentHTML("beforeend", html);
          } else if (order.orderService[0] == "j") {
            jo.insertAdjacentHTML("beforeend", html);
          } else if (order.orderService[0] == "p") {
            pr.insertAdjacentHTML("beforeend", html);
          } else if (order.orderService[0] == "w") {
            we.insertAdjacentHTML("beforeend", html);
          } else if (order.orderService[0] == "o") {
            of .insertAdjacentHTML("beforeend", html);
          }
        });
      } else {
        const html = `<img class="noOrders mt-5" src="../assets/no-orders.png" alt="no-orders" width="100px">
        <h2 class="text-center mt-3 text-warning">No New Orders</h2>`;
        var h = document.querySelector(".newOrderContentRow");
        h.insertAdjacentHTML("afterbegin", html);
      }
    });
};

const loadOngoingOrders = () => {
  var un = document.querySelector(".ongoingOrderUnderRow");
  var ma = document.querySelector(".ongoingOrderMasterRow");
  var we = document.querySelector(".ongoingOrderWebRow");
  var jo = document.querySelector(".ongoingOrderJournalRow");
  var of = document.querySelector(".ongoingOrderOfficialRow");
  var pr = document.querySelector(".ongoingOrderProofRow");
  un.innerHTML = "<h4 class=' fw-bold text-danger'>UnderGraduate</h4><hr>";
  pr.innerHTML = "<h4 class=' fw-bold text-danger'>ProofReading</h4><hr>";
  ma.innerHTML = "<h4 class=' fw-bold text-danger'>Masters</h4><hr>";
  we.innerHTML = "<h4 class=' fw-bold text-danger'>WebSite</h4><hr>";
  jo.innerHTML = "<h4 class=' fw-bold text-danger'>Journal</h4><hr>"; of .innerHTML = "<h4 class=' fw-bold text-danger'>Official Letters</h4><hr>";
  fetch(`http://${host}:8001/order/getOngoingOrders`)
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
          const html = `<div class="ongoingOrder d-flex flex-column text-break col-lg-4 col-md-5 col-sm-11">
          <div class="ongoingOrderChatIcon text-success" onclick="openWhatsappChat('${
            order.customerPhoneNumber
          }')"><i class="bi bi-chat-dots-fill"></i></div>
          <h5 class="text-break text-center text-primary mt-3">${order._id}</h5>
        <h6 class="text-break text-center mt-2">Service: <span class="text-danger">${
          order.orderService
        }</span></h6>
        <h6 class="text-break text-center mt-2">Customer Email: <span class="text-danger">${
          order.customerEmail
        }</span></h6>
        <h6 class="text-break text-center mt-2">Customer Phone Number: <span class="text-danger">${
          order.customerPhoneNumber
        }</span></h6>
        <h6 class="text-break text-center mt-2">Tutor: <span class="text-danger tutorDetailSpan" onClick="showThis('.tutorDetailSection');loadTutorDetails('${
          order.tutorAssigned
        }')">${
            order.tutorAssigned ? order.tutorAssigned : "Yet To Be Assigned"
          }</span></h6>
        <h6 class="text-break  mt-4">Task: <span class="text-danger">${
          order.orderTitle
        }</span></h6>
        <h6 class="text-break  mt-2">Budget: <span class="text-danger">${
          order.orderBudget
        }</span></h6>
            <button onclick="completeOrder('${order._id}')" class="mt-5 ${
            order._id
          }-completeButton" type="button">Mark As Completed</button>
            <h6 class="text-center text-success mt-5 ${
              order._id
            }-completeMessage approvedMessage display-none"><i class="bi bi-check-lg"></i> Order Marked As Completed</h6>
            
          <button onclick="cancelOrder('${order._id}')" class="${
            order._id
          }-cancelOrderButton btn btn-danger mt-3" type="button" >Cancel Order</button>
            <h6 class="text-center text-danger ${
              order._id
            }-cancelOrderMessage cancelledMessage display-none"><i class="bi bi-x-lg"></i> Cancelled</h6>


      </div>`;
          if (order.orderService[0] == "u") {
            un.insertAdjacentHTML("beforeend", html);
          } else if (order.orderService[0] == "m") {
            ma.insertAdjacentHTML("beforeend", html);
          } else if (order.orderService[0] == "j") {
            jo.insertAdjacentHTML("beforeend", html);
          } else if (order.orderService[0] == "p") {
            pr.insertAdjacentHTML("beforeend", html);
          } else if (order.orderService[0] == "w") {
            we.insertAdjacentHTML("beforeend", html);
          } else if (order.orderService[0] == "o") {
            of .insertAdjacentHTML("beforeend", html);
          }
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
  var un = document.querySelector(".completedOrderUnderRow");
  var ma = document.querySelector(".completedOrderMasterRow");
  var we = document.querySelector(".completedOrderWebRow");
  var jo = document.querySelector(".completedOrderJournalRow");
  var of = document.querySelector(".completedOrderOfficialRow");
  var pr = document.querySelector(".completedOrderProofRow");
  un.innerHTML = "<h4 class=' fw-bold text-danger'>UnderGraduate</h4><hr>";
  pr.innerHTML = "<h4 class=' fw-bold text-danger'>ProofReading</h4><hr>";
  ma.innerHTML = "<h4 class=' fw-bold text-danger'>Masters</h4><hr>";
  we.innerHTML = "<h4 class=' fw-bold text-danger'>WebSite</h4><hr>";
  jo.innerHTML = "<h4 class=' fw-bold text-danger'>Journal</h4><hr>"; of .innerHTML = "<h4 class=' fw-bold text-danger'>Official Letters</h4><hr>";
  fetch(`http://${host}:8001/order/getCompletedOrders`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const ourOrders = data.orderArray.map(function (order) {
        return order;
      });
      // $(".owl-carousel").html("");
      ourOrders.forEach((order) => {
        const html = `<div class="completedOrder d-flex flex-column text-break col-lg-4 col-md-5 col-sm-11">
        <div class="completedOrderChatIcon text-success" onclick="openWhatsappChat('${order.customerPhoneNumber}')"><i class="bi bi-chat-dots-fill"></i></div>
        <h5 class="text-break text-center text-primary mt-4">${order._id}</h5>
        <h6 class="text-break  mt-2">Service: <span class="text-danger">${order.orderService}</span></h6>
        <h6 class="text-break  mt-2">Customer Email: <span class="text-danger">${order.customerEmail}</span></h6>
        <h6 class="text-break  mt-2">Customer Phone Number: <span class="text-danger">${order.customerPhoneNumber}</span></h6>
        <h6 class="text-break  mt-2">Tutor: <span class="text-danger tutorDetailSpan" onClick="showThis('.tutorDetailSection');loadTutorDetails('${order.tutorAssigned}')">${order.tutorAssigned}</span></h6>
      </div>`;
        if (order.orderService[0] == "u") {
          un.insertAdjacentHTML("beforeend", html);
        } else if (order.orderService[0] == "m") {
          ma.insertAdjacentHTML("beforeend", html);
        } else if (order.orderService[0] == "j") {
          jo.insertAdjacentHTML("beforeend", html);
        } else if (order.orderService[0] == "p") {
          pr.insertAdjacentHTML("beforeend", html);
        } else if (order.orderService[0] == "w") {
          we.insertAdjacentHTML("beforeend", html);
        } else if (order.orderService[0] == "o") {
          of .insertAdjacentHTML("beforeend", html);
        }
      });
    });
};

const loadCancelledOrders = () => {
  var un = document.querySelector(".cancelledOrderUnderRow");
  var ma = document.querySelector(".cancelledOrderMasterRow");
  var we = document.querySelector(".cancelledOrderWebRow");
  var jo = document.querySelector(".cancelledOrderJournalRow");
  var of = document.querySelector(".cancelledOrderOfficialRow");
  var pr = document.querySelector(".cancelledOrderProofRow");
  un.innerHTML = "<h4 class=' fw-bold text-danger'>UnderGraduate</h4><hr>";
  pr.innerHTML = "<h4 class=' fw-bold text-danger'>ProofReading</h4><hr>";
  ma.innerHTML = "<h4 class=' fw-bold text-danger'>Masters</h4><hr>";
  we.innerHTML = "<h4 class=' fw-bold text-danger'>WebSite</h4><hr>";
  jo.innerHTML = "<h4 class=' fw-bold text-danger'>Journal</h4><hr>"; of .innerHTML = "<h4 class=' fw-bold text-danger'>Official Letters</h4><hr>";
  fetch(`http://${host}:8001/order/getCancelledOrders`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const ourOrders = data.orderArray.map(function (order) {
        return order;
      });
      // $(".owl-carousel").html("");
      ourOrders.forEach((order) => {
        if (!order.isRefunded) {
          var refundButton = `<button class="btn btn-success btn-sm mt-2 ${order._id}-refundOrderButton" onclick="refundOrder('${order._id}')">Mark Order As Refunded</button>`;
        } else {
          var refundButton = `<h6 class="mt-2 text-success ">Refunded</h6>`;
        }
        const html = `<div class="cancelledOrder d-flex flex-column text-break col-lg-4 col-md-5 col-sm-11">
        <div class="cancelledOrderChatIcon text-success" onclick="openWhatsappChat('${order.customerPhoneNumber}')"><i class="bi bi-chat-dots-fill"></i></div>
        <h5 class="text-break text-center text-primary mt-4">${order._id}</h5>
        <h6 class="text-break  mt-2">Service: <span class="text-danger">${order.orderService}</span></h6>
        <h6 class="text-break  mt-2">Customer Email: <span class="text-danger">${order.customerEmail}</span></h6>
        <h6 class="text-break  mt-2">Customer Phone Number: <span class="text-danger">${order.customerPhoneNumber}</span></h6>
        <h6 class="text-break  mt-2">Tutor: <span class="text-danger tutorDetailSpan" onClick="showThis('.tutorDetailSection');loadTutorDetails('${order.tutorAssigned}')">${order.tutorAssigned}</span></h6>
        ${refundButton}
      </div>`;
        if (order.orderService[0] == "u") {
          un.insertAdjacentHTML("beforeend", html);
        } else if (order.orderService[0] == "m") {
          ma.insertAdjacentHTML("beforeend", html);
        } else if (order.orderService[0] == "j") {
          jo.insertAdjacentHTML("beforeend", html);
        } else if (order.orderService[0] == "p") {
          pr.insertAdjacentHTML("beforeend", html);
        } else if (order.orderService[0] == "w") {
          we.insertAdjacentHTML("beforeend", html);
        } else if (order.orderService[0] == "o") {
          of .insertAdjacentHTML("beforeend", html);
        }
      });
    });
};

const approveOrder = (orderId) => {
  if (!document.getElementById(`${orderId}-orderService`).value) {
    $(`.${orderId}-errorMessage`).removeClass("display-none");

    throw new Error("Choose a service");
  }
  fetch(`http://${host}:8001/order/approveOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        orderId: orderId,
        orderService: document.getElementById(`${orderId}-orderService`).value,
        orderTitle: document.getElementById(`${orderId}-orderTitle`).value,
        orderBudget: document.getElementById(`${orderId}-orderBudget`).value,
        orderDuration: document.getElementById(`${orderId}-orderDuration`).value,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $(`.${orderId}-errorMessage`).addClass("display-none");
      $(`.${orderId}-approveButton`).addClass("display-none");
      $(`.${orderId}-cancelOrderButton`).addClass("display-none");
      $(`.${orderId}-approveMessage`).removeClass("display-none");
    });
};

const completeOrder = (orderId) => {
  fetch(`http://${host}:8001/order/markCompleteOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        orderId: orderId,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $(`.${orderId}-completeButton`).addClass("display-none");
      $(`.${orderId}-completeMessage`).removeClass("display-none");
    });
};

const logout = () => {
  window.location.assign(`http://${host}:8001/adminLogin.html`);
};

const loginAdmin = () => {
  var adminLoginUsername = document.getElementById("adminLoginUsername").value;
  var adminLoginPassword = document.getElementById("adminLoginPassword").value;

  fetch(`http://${host}:8001/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        adminUsername: adminLoginUsername,
        adminPassword: adminLoginPassword,
      }),
    })
    .then(function (response) {
      if (response.status == 400) {
        const err = "<p class='text-danger'>Invalid Credentials</p>";
        document.getElementById("errorAuth").innerHTML = err;
        throw new Error("Invalid Credentials");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      window.location.assign(`http://${host}:8001/pages/admin.html`);
      window.localStorage.setItem("loginUser", JSON.stringify(data.admin));
    });
};

const loadNewTutors = () => {
  var h = document.querySelector(".newTutorContentRow");
  h.innerHTML = "";
  fetch(`http://${host}:8001/tutor/getNewTutors`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const ourTutors = data.tutorArray.map(function (tutor) {
        return tutor;
      });
      // $(".owl-carousel").html("");
      if (ourTutors.length > 0) {
        ourTutors.forEach((tutor) => {
          var htmlList = "";
          tutor.orderService.forEach((interest) => {
            htmlList = htmlList + `<li>${interest}</li>`;
          });

          if (ourTutors.length) {
            $(".newTutorOption").addClass("text-primary");
            $(".newTutorOption").html(
              `New Tutors<span class="newOrderNotification bg-primary text-white px-2 mx-2 rounded-circle">${ourTutors.length}</span>`
            );
          }
          const html = `<div class="newTutor d-flex position-relative flex-column align-self-start text-break col-lg-4 col-md-5 col-sm-11">
        <h5 class="text-break text-center text-primary fw-bold">${tutor.tutorName}</h5>
        <h6 class="text-break text-center mt-1"><span class="text-danger">${tutor.tutorEmail}</span></h6>
        <h6 class="text-break text-center mt-1"><span class="text-danger">${tutor.tutorPhoneNumber}</span></h6>
        <p class="tutorDescription mt-2 mb-0"><span class="text-danger fw-bold">About:</span> ${tutor.tutorDescription}</p>
        <p class="text-danger fw-bold mb-1 mt-2">Interested In:</p>
        <ul class="interestsList">${htmlList}</ul>
            <button onclick="approveTutor('${tutor._id}')" class="${tutor._id}-approveTutorButton btn btn-success mb-1" type="button">Approve Tutor</button>
            <button  class="${tutor._id}-rejectTutorButton btn btn-warning mb-1" onclick="showThis('.rejectionMessageDiv-${tutor._id}')" type="button">Reject Tutor</button>
            <button onclick="blockTutor('${tutor._id}')" class="${tutor._id}-blockTutorButton btn btn-danger mb-1" type="button">Block Order</button>
            <h6 class="text-center text-success ${tutor._id}-approveTutorMessage approvedMessage display-none"><i class="bi bi-check-lg"></i> Approved</h6>
            <h6 class="text-center text-danger ${tutor._id}-blockTutorMessage blockedMessage display-none"><i class="bi bi-dash-circle-fill"></i> Blocked</h6>
            <h6 class="text-center text-warning ${tutor._id}-rejectTutorMessage rejectedMessage display-none"><i class="bi bi-exclamation-triangle-fill"></i> Rejected</h6>
        <div id="rejectionMessageDiv-${tutor._id}" class="rejectionMessageDiv-${tutor._id} rejectionMessageDiv display-none">
        <h6 class="mb-2 text-white">Why Reject The Tutor?</h6>
          <textarea id="${tutor._id}-rejectionMessage" cols="30" row="4" placeholder="Rejection Reason" padding="1rem"></textarea>
          <button onclick="rejectTutor('${tutor._id}')" class="btn btn-warning my-2" type="button">Reject Tutor</button>
        </div>
        <button class="tutorDetailChatButtonDiv btn btn-primary mt-3" onclick="openWhatsappChat('${tutor.tutorPhoneNumber}')"><i class="bi bi-chat-dots-fill"></i> Chat With Tutor</button>
      </div>`;
          var h = document.querySelector(".newTutorContentRow");
          h.insertAdjacentHTML("afterbegin", html);
        });
      } else {
        const html = `<img class="noOrders mt-5" src="../assets/no-orders.png" alt="no-orders" width="100px">
        <h2 class="text-center mt-3 text-warning">No New Tutors</h2>`;
        var h = document.querySelector(".newTutorContentRow");
        h.insertAdjacentHTML("afterbegin", html);
      }
    });
};

const approveTutor = (tutorId) => {
  fetch(`http://${host}:8001/tutor/approveTutor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        tutorId: tutorId,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $(`.${tutorId}-approveTutorButton`).addClass("display-none");
      $(`.${tutorId}-rejectTutorButton`).addClass("display-none");
      $(`.${tutorId}-blockTutorButton`).addClass("display-none");
      $(`.${tutorId}-approveTutorMessage`).removeClass("display-none");
    });
};

const blockTutor = (tutorId) => {
  fetch(`http://${host}:8001/tutor/blockTutor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        tutorId: tutorId,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $(`.${tutorId}-approveTutorButton`).addClass("display-none");
      $(`.${tutorId}-rejectTutorButton`).addClass("display-none");
      $(`.${tutorId}-blockTutorButton`).addClass("display-none");
      $(`.${tutorId}-blockTutorMessage`).removeClass("display-none");
    });
};

const rejectTutor = (tutorId) => {
  fetch(`http://${host}:8001/tutor/rejectTutor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        tutorId: tutorId,
        rejectionReason: document.getElementById(`${tutorId}-rejectionMessage`)
          .value,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $(`.${tutorId}-approveTutorButton`).addClass("display-none");
      $(`.${tutorId}-rejectTutorButton`).addClass("display-none");
      $(`.${tutorId}-blockTutorButton`).addClass("display-none");
      hideThis(`#rejectionMessageDiv-${tutorId}`);
      $(`.${tutorId}-rejectTutorMessage`).removeClass("display-none");
    });
};

const loadApprovedTutors = () => {
  var h = document.querySelector(".approvedTutorContentRow");
  h.innerHTML = "";
  fetch(`http://${host}:8001/tutor/getApprovedTutors`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const ourTutors = data.tutorArray.map(function (tutor) {
        return tutor;
      });
      if (ourTutors.length > 0) {
        ourTutors.forEach((tutor) => {
          var htmlList = "";
          var interestList = "";
          tutor.orders.forEach((order) => {
            htmlList = htmlList + `<li>${order}</li>`;
          });
          tutor.orderService.forEach((interest) => {
            interestList = interestList + `<li>${interest}</li>`;
          });
          const html = `<div class="approvedTutor d-flex position-relative flex-column align-self-start text-break col-lg-4 col-md-5 col-sm-11">
        <h5 class="text-break text-center text-primary fw-bold">${
          tutor.tutorName
        }</h5>
        <h6 class="text-break text-center mt-1"><span class="text-danger">${
          tutor.tutorEmail
        }</span></h6>
        <h6 class="text-break text-center mt-1"><span class="text-danger">${
          tutor.tutorPhoneNumber
        }</span></h6>
        <h6 class="text-break text-center text-primary mt-1"><span class="text-success">(${
          tutor._id
        })</span></h6>
        <p class="tutorDescription mt-2 mb-0"><span class="text-danger fw-bold">About:</span> ${
          tutor.tutorDescription
        }</p>
        <p class="text-danger fw-bold mb-1 mt-2">${
          interestList ? "Interested In:" : ""
        }</p>
        <ul class="interestsList">${interestList}</ul>
        <p class="text-danger fw-bold mb-1 mt-2">${
          htmlList ? "Orders:" : ""
        }</p>
        <ul class="ordersList">${htmlList}</ul>
        <button class="tutorDetailChatButtonDiv btn btn-success" onclick="openWhatsappChat('${
          tutor.tutorPhoneNumber
        }')"><i class="bi bi-chat-dots-fill"></i> Chat With Tutor</button>
      </div>`;
          var h = document.querySelector(".approvedTutorContentRow");
          h.insertAdjacentHTML("afterbegin", html);
        });
      } else {
        const html = `<img class="noOrders mt-5" src="../assets/no-orders.png" alt="no-orders" width="100px">
        <h2 class="text-center mt-3 text-warning">No Approved Tutors</h2>`;
        var h = document.querySelector(".approvedTutorContentRow");
        h.insertAdjacentHTML("afterbegin", html);
      }
    });
};

const loadTutorDetails = (tutorId) => {
  if (tutorId == "undefined") {
    $(".tutorDetailContentRow").html(
      `<h4 class="text-center">Tutor is yet To be Assigned</h4>`
    );
    return;
  }
  fetch(`http://${host}:8001/tutor/getTutorDetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        tutorId: tutorId,
      }),
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var html = "";
      data.tutor.orderService.forEach((service) => {
        html = html + `<li>${service}</li>`;
      });
      $(".tutorDetailName").html(
        `<span class="text-danger">Name: </span>${data.tutor.tutorName}`
      );
      $(".tutorDetailEmail").html(
        `<span class="text-danger">Email: </span>${data.tutor.tutorEmail}`
      );
      $(".tutorDetailPhoneNumber").html(
        `<span class="text-danger">Phone Number: </span>${data.tutor.tutorPhoneNumber}`
      );
      $(".tutorDetailId").html(
        `<span class="text-danger">Tutor Id: </span>${data.tutor._id}`
      );
      $(".tutorDetailAbout").html(
        `<span class="text-danger">About Tutor: </span>${data.tutor.tutorDescription}`
      );

      $(".tutorDetailInterestList").html(html);
      $(".tutorDetailChatButtonDiv").html(
        `<button class="tutorDetailChatButtonDiv btn btn-success" onclick="openWhatsappChat('${data.tutor.tutorPhoneNumber}')"><i class="bi bi-chat-dots-fill"></i> Chat With Tutor</button>`
      );
    });
};

const loadNewReviews = () => {
  var h = document.querySelector(".newReviewContentRow");
  h.innerHTML = "";
  fetch(`http://${host}:8001/review/getNotHighlightedReviews`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const ourReviews = data.reviewsArray.map(function (review) {
        return review;
      });
      // $(".owl-carousel").html("");
      if (ourReviews.length) {
        $(".newReviewOption").addClass("text-primary");
        $(".newReviewOption").html(
          `New Reviews<span class="newOrderNotification bg-primary text-white px-2 mx-2 rounded-circle">${ourReviews.length}</span>`
        );
      }

      if (ourReviews.length > 0) {
        ourReviews.forEach((review) => {
          const html = `<div class="newReview d-flex flex-column text-break col-lg-4 col-md-5 col-sm-11">
        <h6 class="text-break text-center mt-2">Customer Name: <span class="text-danger">${review.customerName}</span></h6>
        
        <h6 class="text-break  mt-4">Review: <span class="text-danger">${review.customerReview}</span></h6>
       
        <button onclick="highlightReview('${review._id}')" class="mt-5 ${review._id}-highlightReviewButton" type="button">Highlight This Review</button>
        <h6 class="text-center text-success mt-5 ${review._id}-highlightReviewMessage display-none"><i class="bi bi-check-lg"></i> Review Highlighted</h6>

        <button onclick="removeReview('${review._id}')" class="mt-2 ${review._id}-removeReviewButton btn btn-danger" type="button">Remove This Review</button>
        <h6 class="text-center text-danger mt-5 ${review._id}-removeReviewMessage display-none"><i class="bi bi-check-lg"></i> Review Removed</h6>

      </div>`;
          var h = document.querySelector(".newReviewContentRow");
          h.insertAdjacentHTML("afterbegin", html);
        });
      } else {
        const html = `<img class="noOrders mt-5" src="../assets/no-orders.png" alt="no-reviews" width="100px">
        <h2 class="text-center mt-3 text-warning">No New Reviews</h2>`;
        var h = document.querySelector(".newReviewContentRow");
        h.insertAdjacentHTML("afterbegin", html);
      }
    });
};

const loadNewMessages = () => {
  var h = document.querySelector(".newMessageContentRow");
  h.innerHTML = "";
  fetch(`http://${host}:8001/contactUs/getContactUsMessages`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const ourMessages = data.contactUs.map(function (message) {
        return message;
      });
      if (ourMessages.length) {
        $(".newMessageOption").addClass("text-primary");
        $(".newMessageOption").html(
          `New Messages<span class="newOrderNotification bg-primary text-white px-2 mx-2 rounded-circle">${ourMessages.length}</span>`
        );
      }

      if (ourMessages.length > 0) {
        ourMessages.forEach((message) => {
          const html = `<div class="newMessage d-flex flex-column text-break col-lg-4 col-md-5 col-sm-11">
        <h6 class="text-break text-center mt-2">Name: <span class="text-danger">${message.contactUsName}</span></h6>
        <h6 class="text-break text-center mt-2">Email: <span class="text-danger">${message.contactUsEmail}</span></h6>
        
        <h6 class="text-break  mt-4">Message: <span class="text-danger">${message.contactUsMessage}</span></h6>
        <h5 class="text-primary mt-5">Reply:</h5>
        <textarea name="contactUsReply" class="${message._id}-contactUsReplyTextArea contactUsReplyTextArea" placeholder="Review Your Previous Order" id="${message._id}-contactUsReplyTextArea" rows="5"></textarea>
        <h4 class="${message._id}-replyToMessageMessage display-none"></h4>
        <button onclick="replyToMessage('${message._id}')" class="mt-2 ${message._id}-replyToMessageButton btn btn-success" type="button">Reply</button>

        
        </div>`;
          var h = document.querySelector(".newMessageContentRow");
          h.insertAdjacentHTML("afterbegin", html);
        });
      } else {
        const html = `<img class="noOrders mt-5" src="../assets/no-orders.png" alt="no-messages" width="100px">
        <h2 class="text-center mt-3 text-warning">No New Messages</h2>`;
        var h = document.querySelector(".newMessageContentRow");
        h.insertAdjacentHTML("afterbegin", html);
      }
    });
};

const loadHighlightedReviews = () => {
  var h = document.querySelector(".highlightedReviewContentRow");
  h.innerHTML = "";
  fetch(`http://${host}:8001/review/getHighlightedReviews`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const ourReviews = data.reviewsArray.map(function (review) {
        return review;
      });
      // $(".owl-carousel").html("");

      if (ourReviews.length > 0) {
        ourReviews.forEach((review) => {
          const html = `<div class="newReview d-flex flex-column text-break col-lg-4 col-md-5 col-sm-11">
        <h6 class="text-break text-center mt-2">Customer Name: <span class="text-danger">${review.customerName}</span></h6>
        
        <h6 class="text-break  mt-4">Review: <span class="text-danger">${review.customerReview}</span></h6>
       
            <button onclick="unHighlightReview('${review._id}')" class="mt-5 ${review._id}-unHighlightReviewButton btn btn-danger" type="button">Unhighlight This Review</button>
            <h6 class="text-center text-danger mt-5 ${review._id}-unHighlightReviewMessage display-none"><i class="bi bi-warning"></i> Review Un-Highlighted</h6>

      </div>`;
          var h = document.querySelector(".highlightedReviewContentRow");
          h.insertAdjacentHTML("afterbegin", html);
        });
      } else {
        const html = `<img class="noOrders mt-5" src="../assets/no-orders.png" alt="no-reviews" width="100px">
        <h2 class="text-center mt-3 text-warning">No Highlighted Reviews</h2>`;
        var h = document.querySelector(".newReviewContentRow");
        h.insertAdjacentHTML("afterbegin", html);
      }
    });
};

const highlightReview = (reviewId) => {
  fetch(`http://${host}:8001/review/highlightReview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        reviewId: reviewId,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $(`.${reviewId}-highlightReviewButton`).addClass("display-none");
      $(`.${reviewId}-highlightReviewMessage`).removeClass("display-none");
    });
};

const unHighlightReview = (reviewId) => {
  fetch(`http://${host}:8001/review/unHighlightReview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        reviewId: reviewId,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $(`.${reviewId}-unHighlightReviewButton`).addClass("display-none");
      $(`.${reviewId}-unHighlightReviewMessage`).removeClass("display-none");
    });
};
const removeReview = (reviewId) => {
  fetch(`http://${host}:8001/review/removeReview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        reviewId: reviewId,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $(`.${reviewId}-removeReviewButton`).addClass("display-none");
      $(`.${reviewId}-removeReviewMessage`).removeClass("display-none");
    });
};

const openChatBox = () => {
  $(".freechat-popup").addClass("freechat-popup-show");
};

const downloadOrderFiles = (orderId) => {
  window.open(`http://${host}:8001/order/downloadOrderFiles/${orderId}`);
};

const openWhatsappChat = (phoneNumber) => {
  window.open(`http://wa.me/${phoneNumber}`);
};

const replyToMessage = (messageId) => {
  const reply = $(`.${messageId}-contactUsReplyTextArea`).val();
  fetch(`http://${host}:8001/contactUs/replyToMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        messageId: messageId,
        reply: reply,
      }),
    })
    .then(function (response) {
      if (response.status != 200) {
        $(`.${messageId}-replyToMessageMessage`).removeClass("display-none");
        $(`.${messageId}-replyToMessageMessage`).text(
          "cannot reply to message"
        );
        throw Error;
      }
      return response.json();
    })
    .then(function (data) {
      $(`.${messageId}-replyToMessageButton`).addClass("display-none");
      $(`.${messageId}-replyToMessageMessage`).removeClass("display-none");
      $(`.${messageId}-replyToMessageMessage`).text("Replied!");
    });
};

const cancelOrder = (orderId) => {
  fetch(`http://${host}:8001/order/cancelOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        orderId: orderId,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $(`.${orderId}-cancelOrderButton`).addClass("display-none");
      $(`.${orderId}-cancelOrderMessage`).removeClass("display-none");
      $(`.${orderId}-approveButton`).addClass("display-none");
      $(`.${orderId}-approveMessage`).addClass("display-none");
    });
};

const refundOrder = (orderId) => {
  fetch(`http://${host}:8001/order/refundOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        orderId: orderId,
      }),
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $(`.${orderId}-refundOrderButton`).addClass("display-none");
    });
};