const express=require("express");
const dbConnect = require("./config/dbConnect");
const app=express();
const cors = require('cors');
const cookieParser=require("cookie-parser")
const dotenv=require("dotenv").config({path:"./.env"})
const PORT =process.env.PORT || 5000  ;
const authRouter=require('./routes/authRoutes');
const productRouter=require('./routes/productRoutes')
// const blogRouter=require("./routes/blogRoute")
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errrorHandler");
const morgan=require("morgan");
const productCategoryRouter  = require("./routes/productCategoryRoutes");
// const blogCategoryRouter=require("./routes/blogCategoryRoutes")
const brandRouter=require('./routes/brandRoutes')
// const colorRouter=require('./routes/colorRoutes')
// const coupanRouter=require('./routes/coupanRoutes')
const enquiryRouter=require('./routes/enqRoutes')
dbConnect()
app.use(morgan('dev'))
// app.use(cors())
app.use(cors({
  origin: 'https://pet-frontend-phi.vercel.app', // 比如 'https://lovepet-front.onrender.com'
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use('/api/user',authRouter)
app.use("/api/product", productRouter);
// app.use("/api/blog",blogRouter );
app.use("/api/productCategory", productCategoryRouter);
// app.use("/api/blogCategory", blogCategoryRouter);
app.use("/api/brand",brandRouter );
// app.use("/api/color",colorRouter );
// app.use("/api/coupan",coupanRouter );
app.use("/api/enquiry", enquiryRouter);
app.use(notFound)
app.use(errorHandler)
app.listen(PORT,()=>{
    console.log(`server is running on  port ${PORT}`)
})