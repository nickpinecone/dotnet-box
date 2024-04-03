import mongoose, { Schema } from "mongoose";

const CertificateSchema = new Schema({
    photo: String,
    description: String,

    updatedAt: {
        type: Date,
        default: Date.now(),
    },

    portfolio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "portfolio"
    },
});

const Certificate = mongoose.model("certificate", CertificateSchema);

export default Certificate;