import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";
const productsSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // category: {
    //     type: String,
    //     required: true
    // },
    code: {
        type: String,
        unique: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
});

mongoosePaginate.paginate.options = {
  limit: 10,
  customLabels: {
    docs: "payload",
    pagingCounter: false,
    totalDocs: false,
    limit: false,
  }
}

productsSchema.plugin(mongoosePaginate);

const ProductsModel = mongoose.model(productsCollection, productsSchema);

export default ProductsModel;