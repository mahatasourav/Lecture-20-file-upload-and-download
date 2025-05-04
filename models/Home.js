const mongoose = require("mongoose");

const homeSchema = mongoose.Schema({
  homename: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: String,
  Rating: {
    type: Number,
    required: true,
  },
  description: String,
});

// homeSchema.pre("findOneAndDelete", async function (next) {
//   console.log("coming to pre hook");

//   const homeId = this.getQuery()._id;
//   await Favourite.deleteMany({ homeId: homeId });
//   next();
// });

module.exports = mongoose.model("Home", homeSchema);
