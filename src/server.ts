import * as dotenv from 'dotenv';
dotenv.config();


// SERVET Start and Load balancer --> Next staging is loadbalancer
import App from "./app";
import ConnectionDB from './config/database';

// Connection to database --> step



// Connection Redis --> next step



const app = App.getInstance().getApp();
const port = process.env.PORT || 4002;

process.on("uncaughtException", (error) => console.log("uncaughtException: ", error));

// Create Server and run for endpoint
const serverStarter = async () => {
    ConnectionDB.getInitDbInstance();

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

serverStarter();