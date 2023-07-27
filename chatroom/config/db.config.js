
const mongoose = require('mongoose')

const DBConnect = () => {mongoose.connect(process.env.DB_URL,
  {
  //   useNewUrlParser: true,
  //   // useFindAndModify: false,
  //   useUnifiedTopology: true
  }
).then(()=>{
  console.log("Db connected")
})};
 
module.exports = DBConnect