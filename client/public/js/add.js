exports.getCancelledOrders = async function (req, res) {
  const customerEmail = req.body.customerEmail;
  const userAlready = await Customer.findOne({
    customerEmail: customerEmail,
  }).exec();
  const cancelledOrdersArray = Promise.all(
    userAlready.orders.map(async function (orderId) {
      const order = await Order.findById(orderId).exec();
      if (order.completed && !order.isCancelled) {
        return order;
      }
    })
  );
  cancelledOrdersArray.then((data) => {
    const cancelledOrdersFilteredArray = data.filter((order) => {
      return order != undefined;
    });
    return res.status(200).json({
      cancelledOrdersArray: cancelledOrdersFilteredArray,
    });
  });
};
