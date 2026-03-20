var express = require('express');
var router = express.Router();
let slugify = require('slugify')
let productSchema = require('../schemas/products')
let inventorySchema = require('../schemas/iventory')

router.get("/", async function (req, res, next) {
    try {
        let data = await inventorySchema.find({}).populate({ path: 'product', select: 'title images' })
        res.send(data);
    } catch (error) {
        res.status(404).send(error.message);
    }
})

router.get("/:id", async function (req, res, next) {
    try {
        let data = await inventorySchema.findOne({ _id: req.params.id }).populate({ path: 'product', select: 'title images' })
        res.send(data);
    } catch (error) {
        res.status(404).send(error.message);
    }
})

router.post("/add_stock", async function (req, res, next) {
    try {
        let data = await inventorySchema.findOne({ product: req.body.productId })
        if (data) {
            data.stock += req.body.stock
            await data.save()
            res.send(data);
        } else {
            res.status(404).send({
                message: "ID not found"
            })
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
})

router.post("/remove_stock", async function (req, res, next) {
    try {
        let data = await inventorySchema.findOne({ product: req.body.productId })
        if (data) {
            data.stock -= req.body.stock
            await data.save()
            res.send(data);
        } else {
            res.status(404).send({
                message: "ID not found"
            })
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
})

router.post("/reserved", async function (req, res, next) {
    try {
        let data = await inventorySchema.findOne({ product: req.body.productId })
        if (data) {
            let quantity = req.body.quantity || 1;
            if (data.stock >= quantity) {
                data.stock -= quantity;
                data.reserved += quantity;
                await data.save();
                res.status(200).send(data);
            } else {
                res.status(400).send({
                    message: "Not enough stock"
                })
            }
        } else {
            res.status(404).send({
                message: "Product not found"
            })
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
})

router.post("/sold", async function (req, res, next) {
    try {
        let data = await inventorySchema.findOne({ product: req.body.productId })
        if (data) {
            let quantity = req.body.quantity || 1;
            if (data.reserved >= quantity) {
                data.reserved -= quantity;
                data.soldcount += quantity;
                await data.save();
                res.status(200).send(data);
            } else {
                res.status(400).send({
                    message: "Not enough reserved stock"
                })
            }
        } else {
            res.status(404).send({
                message: "Product not found"
            })
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
})
module.exports = router;