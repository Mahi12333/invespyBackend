import  express  from "express";
import path from "path"
import dotenv from "dotenv"
import cors from "cors"
import {connectDB} from "./config/db.js";
import userRoutes from './routes/userRoutes.js'
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config()

// commented by ramesh

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
connectDB()

app.use(cookieParser());


app.use(cors((
    {
        origin:[""],
        credentials:true,
        methods:["POST","GET","PUT"]
    }
)))

app.use('/api/users', userRoutes)

if (process.env.NODE_ENV === 'development') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'frontend/dist')))
    app.get('*' , (req, res) => res.sendFile(path.resolve(__dirname, 'frontend' , 'dist', 'index.html')));
}
else{
    app.get('/', (res,req) => res.send('Server is ready'));
}


app.use(notFound);
app.use(errorHandler);

app.listen(port , () => console.log(`Server started on port ${port}`));

// /zassj