const mongoose = require("mongoose");

// mongodb connection
const mongoConnection = () => {
  mongoose.connect(
    process.env.MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    () => {
      console.log("connection to MONGO-DB established");
    }
  );
};

module.exports = {
  mongoConnection,
};
