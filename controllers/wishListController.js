const wishListDB = require("../models/wishlist.model")
const mongoose = require("mongoose");
const cartDB = mongoose.model("User_Cart");
const Product = mongoose.model("Product");
const asynchandler = require('express-async-handler')
const {
    errorRes,
    internalServerError,
    successRes,
} = require("../utility/index");


//test route
const test = asynchandler(async (req, res) => {
    successRes(res, 'Success wishlist route');
});

//add to wishlist
const addToWishList = asynchandler(async (req, res) => {
    const { _id } = req.user;
    const { productId, type } = req.params;

    if (!productId) return errorRes(res, 400, "Invalid product Id.");
    if (type != "add" && type != "subtract" && type != "delete") {
        return errorRes(
            res,
            400,
            "Request type can be - 'add', 'subtract' or 'delete'."
        );
    }

    try {
        const wishlist = await wishListDB.findOne({ userId: _id });
        if (!wishlist)
            return errorRes(res, 400, "Internal server error. Please try again.");

        const productIndex = wishlist.products.findIndex(p => p.product == productId);

        if (productIndex > -1) {
            console.log('here1');

            if (type === "add") {
                console.log("add 1");
                const existingProduct = await Product.findById(productId);
                if (!existingProduct)
                    return errorRes(
                        res,
                        404,
                        "Product for which you are trying to update quantity does not exist."
                    );

                if (
                    existingProduct.availability >=
                    wishlist.products[productIndex].quantity + 1
                ) {
                    let p = await Product.findById(productId);
                    let isWishlist = p.isWishlist;
                    if (!isWishlist) {
                        isWishlist = [];
                    }
                    isWishlist.push(_id);
                    await Product.findByIdAndUpdate(productId, { $set: { isWishlist } }, { new: true });

                    wishlist.products[productIndex].quantity++;
                }
                else
                    return errorRes(
                        res,
                        404,
                        `Quantity for "${existingProduct.displayName}" cannot be more than ${existingProduct.availability}`
                    );

                // cart.products[productIndex].quantity++
            } else if (type === "subtract") {
                console.log("subtract 1");
                if (wishlist.products[productIndex].quantity >= 2) {
                    wishlist.products[productIndex].quantity--;

                    let p = await Product.findById(productId);
                    let isWishlist = p.isWishlist;
                    isWishlist.splice(isWishlist.indexOf(_id), 1);
                    await Product.findByIdAndUpdate(productId, { $set: { isWishlist } }, { new: true });
                }
                else {
                    let p = await Product.findById(productId);
                    let isWishlist = p.isWishlist;
                    isWishlist.splice(isWishlist.indexOf(_id), 1);
                    await Product.findByIdAndUpdate(productId, { $set: { isWishlist } }, { new: true });

                    wishlist.products.splice(productIndex, 1);
                }
            } else {
                console.log("subtract 2");
                let p = await Product.findById(productId);
                let isWishlist = p.isWishlist;
                isWishlist.splice(isWishlist.indexOf(_id), 1);
                await Product.findByIdAndUpdate(productId, { $set: { isWishlist } }, { new: true });

                wishlist.products.splice(productIndex, 1);
            }
        } else {
            console.log('here')
            if (type === "add") {
                console.log("add 2");

                let p = await Product.findById(productId);
                let isWishlist = p.isWishlist;
                if (!isWishlist) {
                    isWishlist = [];
                }
                isWishlist.push(_id);
                await Product.findByIdAndUpdate(productId, { $set: { isWishlist } }, { new: true });

                wishlist.products.push({ product: productId, quantity: 1 });
            }
            else return errorRes(res, 400, "Product does not exist in wishlist.");
        }

        await wishlist
            .save()
            .then(updatedWishList => {
                updatedWishList
                    .populate([
                        {
                            path: "products.product",
                            select:
                                "_id displayName brand_title color price product_category displayImage availability isWishlist",
                        },
                        { path: "user", select: "displayName email" },
                    ])
                    .then(result =>
                        successRes(res, {
                            wishlist: result,
                            message: "wishlist updated successfully.",
                        })
                    );
            })
            .catch(err => { console.log(err); internalServerError(res, err) });
    } catch (err) {
        console.log(err)
        internalServerError(res, err);
    }
});

//get wishlist
const getWishList = asynchandler(async (req, res) => {
    const userId = req.user;
    console.log(req.user);
    if (!userId) {
        return errorRes(res, 401, 'Cannot fetch user without the user id');
    }
    try {
        const findWishlist = await wishListDB.findOne({ userId: userId }).populate(
            "products.product",
            "_id displayName brand_title color price product_category displayImage availability priceVarient"
        )
        if (findWishlist) {
            successRes(res, findWishlist);
        }
        else {
            errorRes(res, 404, "Error fetching the wishlist");
        }

    } catch (error) {
        return internalServerError(res, error);
    }
});

//move to cart from wishlist
const moveToCart = asynchandler(async (req, res) => {
    const { _id } = req.user;
    const { productId } = req.params;

    if (!productId) return errorRes(res, 400, "Invalid product Id.");

    try {
        const wishlist = await wishListDB.findOne({ userId: _id });
        const cart = await cartDB.findOne({ userId: _id });
        if (!wishlist || !cart) {
            return errorRes(res, 400, "Internal server error. Please try again.");
        }

        const productIndex = wishlist.products.findIndex(p => p.product == productId);
        if (productIndex < 0) {
            return errorRes(res, 400, "Product does not exist in wishlist.");
        }

        const data = wishlist.products[productIndex];
        cart.products.push({ product: productId, quantity: data.quantity });
        wishlist.products.splice(productIndex, 1);

        const updateCart = await cart.save();

        await Product.findByIdAndUpdate(productId, { $set: { isWishlist: "false" } }, { new: true });

        if (!updateCart) return errorRes(res, 400, 'Error in saving cart');

        await wishlist
            .save()
            .then(updatedWishList => {
                updatedWishList
                    .populate([
                        {
                            path: "products.product",
                            select:
                                "_id displayName brand_title color price product_category displayImage availability",
                        },
                        { path: "user", select: "displayName email" },
                    ])
                    .then(result =>
                        successRes(res, {
                            wishlist: result,
                            message: "wishlist updated successfully.",
                        })
                    );
            })
            .catch(err => { console.log(err); internalServerError(res, err) });


    } catch (error) {
        console.log(error)
        internalServerError(res, error);
    }
});

module.exports = { test, addToWishList, getWishList, moveToCart };
