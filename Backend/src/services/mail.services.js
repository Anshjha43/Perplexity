import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     type: "OAuth2",
//     user: process.env.GOOGLE_USER,
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//   },
// });
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("Email transporter is ready to send email");
  })
  .catch((error) => {
    console.log("Email transporter is failed to send email", error);
  });

export async function sendemail({ to, subject, html, text = "" }) {
  const mailoption = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    text,
    html,
  };
  console.log("before email send");
  const details = await transporter.sendMail(mailoption);
  console.log(details);

  return "email sent successfully to " + to;
}
