const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const mySchema = mongoose.Schema({
    products: [
        {
            product: {
                type: ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    order_price: {
        type: String,
        required: true,
    },
    coupon_applied: {
        type: ObjectId,
        ref: "Coupon",
        default: null,
    },
    shippingAddress: {
        type: Array,
        default: []
    },
    shippingAddress1: {
        type: Object,
        default: {}
    },
    payment_mode: {
        type: String,
        enum: ["COD", "ONLINE"],
        required: true,
    },
    payment_status: {
        type: String,
        enum: ["PENDING", "COMPLETE", "FAILED"],
        required: true,
    },
    order_status: {
        type: String,
        enum: ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED BY ADMIN"],
        required: true,
        default: "PLACED",
    },
    cc_orderId: {
        type: String,
        // required: true,
    },
    cc_bankRefNo: {
        type: String,
        // required: true,
    },
},{
    timestamps: true
});

const GuestOrder = mongoose.model('GuestOrder', mySchema);

module.exports = GuestOrder;
