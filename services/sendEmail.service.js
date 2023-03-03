const nodemailer = require('nodemailer')

module.exports = async (from, to, html, text, subject) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text
  })

  return info
}