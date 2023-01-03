const { Conflict } = require("http-errors");
const gravatar = require("gravatar");
// const bcrypt = require("bcryptjs");
const { sendEmail } = require("../../helpers");
const { User } = require("../../models");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new Conflict(`User with ${email} already exist`);
  }

  const avatarUrl = gravatar.url(email);
  const verificationToken = Date.now().toString();
  const newUser = new User({ name, email, avatarUrl, verificationToken });
  newUser.setPassword(password);
  await newUser.save();
  const mail = {
    to: email,
    subject: "Confirming email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Confirm email</a>`,
  };
  //   const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  //   const result = await User.create({ name, email, password: hashPassword });
  await sendEmail(mail);
  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      user: {
        name,
        email,
        avatarUrl,
        verificationToken,
      },
    },
  });
};

module.exports = register;
