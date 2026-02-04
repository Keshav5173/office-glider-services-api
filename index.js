import express from 'express';
import 'dotenv/config';

const app = express();


app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true}));



import router from './src/routes/index.js';

app.use(express.json());
app.use('/api', router);


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
