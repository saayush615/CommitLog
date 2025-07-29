const express = require('express');
const Path = require('path');
const mongooose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const { checkAuth } = require('./middlewares/auth');
const {upload} = require('./services/upload');

const static = require('./routes/staticRoute');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');


const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkAuth); // Middleware to check authentication
app.use(methodOverride('_method')); // Use method-override to support DELETE and PUT methods

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(Path.join(__dirname, 'uploads')));

// Connect to DB
async function connectDB(){
    await mongooose.connect(process.env.BlogifyDB);
    console.log('✅ Connected to DB');
};
connectDB().catch((err) => { 
    console.log('❌ Error connecting to DB', err);
    process.exit(1);
});

app.set('view engine', 'ejs');
app.set('views', Path.join(__dirname, 'views'));

app.use('/', static);
app.use('/user', userRoute);
app.use('/blog', blogRoute);


const port = process.env.PORT || 3000;
app.listen(port,() => { 
    console.log(`Server is running on port ${port}`);
 })
