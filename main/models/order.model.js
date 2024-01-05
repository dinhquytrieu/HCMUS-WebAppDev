const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  idaccount: { type: mongoose.Schema.Types.ObjectId, ref: 'ms.account' },
  name: String,
  phone: String,
  email: String,
  address: String,
  message: String,
  detail: [{
    idProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'ms.product' },
    quantity: Number
  }],
  status: { type: String, enum: ['canceled', 'pending', 'successful'], required: true },
  date: { type: Date, default: Date.now },
  isOnline: Boolean
});

const Order = mongoose.model('ms.order', orderSchema);

module.exports = Order;