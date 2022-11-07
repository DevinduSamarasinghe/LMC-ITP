import mongoose from "mongoose";

const Schema =  mongoose.Schema;
const purchaseOrderSchema = new Schema({

    //OrderID
    //supplierID
    //qty
    //productDetails
    //deliveryDate
    //cost
    //orderStatus

    orderID:{
        type: String,
        required:true,
        unique:true
    },
    supplierID:{
        type: String,
        required:true
    },
    qty:{
        type: Number,
        required:true
    },
    productDetails:{
        type: String,
        required:true
    },
    deliveryDate:{
        type: String,
        required:true
    },
    cost:{
        type: Number,
        required:true
    },
    orderStatus:{
        type: String,
        required:true
    }
});

const purchaseOrder = mongoose.model("PurchaseOrder",purchaseOrderSchema);
export default purchaseOrder;