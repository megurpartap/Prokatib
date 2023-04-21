const ContactUs = require("../models/contactUs");
var nodemailer = require("nodemailer");

exports.createContactUs = (req, res) => {
  const contactUs = new ContactUs(req.body);
  contactUs.save((error, contactUs) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        error: "ContactUs Cannot be Created",
      });
    }
    return res.json({
      message: "ContactUs Created",
    });
  });
};

exports.getContactUsMessages = (req, res) => {
  ContactUs.find({ replied: false }, (error, contactUsArray) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        error: "ContactUs Messages Cannot be Retrieved",
      });
    }
    return res.json({
      contactUs: contactUsArray,
    });
  });
};

exports.replyToMessage = (req, res) => {
  ContactUs.findById(req.body.messageId, (error, contactUs) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        error: "ContactUs Cannot be Replied",
      });
    }
    sendEmail(
      contactUs.contactUsEmail,
      req.body.reply,
      "Prokatib Has Replied to Your Message"
    );
    contactUs.replied = true;
    contactUs.save((error, contactUs) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          error: "ContactUs Cannot be Replied",
        });
      }
      return res.json({
        message: "ContactUs Replied",
      });
    });
  });
};

const sendEmail = (to, message, subject) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "prokatib@gmail.com",
      pass: "Hello123@",
    },
  });

  var mailOptions = {
    from: '"Prokatib" <prokatib@gmail.com>',
    to: to,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
