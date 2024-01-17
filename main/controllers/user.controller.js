const User = require("../models/account.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Order = require("../models/order.model");
require("dotenv").config();

class userController {
  checkRole = (role) => (req, res, next) => {
    if (req.cookies && req.cookies.user && req.cookies.user.role == role) {
      return next();
    }
    res.redirect("/user/signin");
  };

  isLogin = (req, res, next) => {
    if (req.cookies && req.cookies.user) {
      return next();
    }
    res.redirect("/user/signin");
  };

  // [GET] /
  getSignInP = async (req, res, next) => {
    try {
      res.render("signIn", {});
    } catch (err) {
      next(err);
    }
  };

  getSignUpP = async (req, res, next) => {
    try {
      const { lastname, firstname, email, phone, address } = req.query;
      res.render("signUp", { lastname, firstname, email, phone, address });
    } catch (err) {
      next(err);
    }
  };

  //[POST]
  SignUp = async (req, res, next) => {
    try {
      const {
        inputFirstName,
        inputLastName,
        inputEmail,
        inputPassword,
        inputPhoneNumber,
        inputAddress,
      } = req.body;
      const existingUser = await User.findOne({ email: inputEmail });

      if (existingUser) {
        return res.render("signUp", {
          emailMsg: "Email already exists",
          lastname: inputLastName,
          firstname: inputFirstName,
          email: inputEmail,
          phone: inputPhoneNumber,
          address: inputAddress,
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPw = await bcrypt.hash(inputPassword, salt);

      // await newUser.save();
      res.render("confirm", {
        lastname: inputLastName,
        firstname: inputFirstName,
        email: inputEmail,
        phone: inputPhoneNumber,
        address: inputAddress,
        password: hashedPw,
      });
    } catch (err) {
      next(err);
    }
  };

  authenticatePassword = async (req, res, next) => {
    try {
      console.log("1");
      // Giải mã JWT
      const token = req.body.token;
      if (!token) {
        return res.status(400).json({ error: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      // Xử lý dữ liệu đơn hàng từ JWT
      // Ví dụ: Lưu đơn hàng vào cơ sở dữ liệu
      // const user = await User.findOne({ email: inputEmail });
      // const accountId = req.cookies.user._id.toString();
      // // Tìm tài khoản người dùng
      const user = await User.findById(decoded.idAccount);
      const validPassword = await bcrypt.compare(decoded.pw, user.password);
      const responseData = {
        success: "successfully sending order",
        validPw: validPassword,
      };
      // Xóa giỏ hàng sau khi tạo đơn hàng
      user.cart = [];
      await user.save();

      res.json(responseData);
    } catch (error) {
      // Xử lý lỗi JWT hoặc lỗi khác
      next(error);
    }
  };
  paymentSuccess = async (req, res, next) => {
    try {
      // Giải mã JWT
      const token = req.body.token;
      if (!token) {
        return res.status(400).json({ error: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      const order = await Order.findById(decoded.idorder);
      const user = await User.findById(decoded.idAccount);
      order.status = "pending";
      await order.save();
      // Xóa giỏ hàng sau khi tạo đơn hàng
      user.cart = [];
      await user.save();
      // const validPassword = await bcrypt.compare(decoded.pw, user.password);
      const responseData = {
        success: "successfully sending order",
        order: decoded,
      };
      console.log("check order MAIN");
      console.log(order);
      console.log("end check order MAIN");

      res.json(responseData);
    } catch (error) {
      // Xử lý lỗi JWT hoặc lỗi khác
      next(error);
    }
  };
  sendTokenAndSaveUser = async (req, res, next) => {
    try {
      const { lastname, firstname, email, phone, address, password } = req.body;

      //create accessToken
      const newUser = await new User({
        lastname,
        firstname,
        email,
        phone,
        address: address,
      });
      // console.log('newUser:', newUser);
      const accessToken = jwt.sign(
        {
          user: newUser,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "10m" }
      );
      const rs = await fetch(
        `https://localhost:${process.env.AUX_PORT}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: accessToken }),
        }
      );
      const response = await rs.json();

      console.log("RESPONSE: ", response);

      //save the user to the database
      newUser.password = password;
      newUser.role = "user";
      await newUser.save();
      res.cookie("user", newUser, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  };

  SignIn = async (req, res, next) => {
    try {
      const { inputEmail, inputPassword } = req.body;
      const user = await User.findOne({ email: inputEmail });
      if (!user) {
        return res.render("signIn", {
          emailMsg: "Email is invalid!",
          inputEmail,
          inputPassword,
        });
      }
      const validPassword = await bcrypt.compare(inputPassword, user.password);
      if (!validPassword) {
        return res.render("signIn", {
          pwMsg: "Password is wrong!",
          inputEmail,
          inputPassword,
        });
      }
      res.cookie("user", user, {
        httpOnly: true,
        secure: false,
        path: "/",
        // sameSite: "strict",
      });
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  };
  Logout = (req, res) => {
    res.clearCookie("user");
    res.redirect("/user/signin");
  };

  getHandle = async (req, res, next) => {
    try {
      // Tìm tất cả người dùng
      const allUsers = await User.find();

      // Tạo mảng chứa thông tin của mỗi người dùng
      const usersInfo = await Promise.all(
        allUsers.map(async (user) => {
          // Tìm số đơn hàng của người dùng
          const totalOrders = await Order.countDocuments({
            idaccount: user._id,
          });

          // Tìm số đơn hàng thành công của người dùng
          const successfulOrders = await Order.countDocuments({
            idaccount: user._id,
            status: "successful",
          });

          // Tính tỉ lệ đặt đơn hàng thành công
          const successOrderRate =
            totalOrders > 0
              ? Math.round((successfulOrders / totalOrders) * 100)
              : 0;

          // Loại bỏ trường cart khỏi thông tin người dùng
          const { cart, password, __v, ...userInfo } = user.toObject();
          // Trả về thông tin của người dùng kèm theo số đơn hàng và số tiền đã chi
          return {
            user: userInfo,
            totalOrders,
            successOrderRate,
          };
        })
      );
      // console.log(usersInfo);
      res.render("accounthandle", { nshowHF: true, usersInfo });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new userController();
