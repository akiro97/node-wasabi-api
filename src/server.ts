import moduleAlias from "module-alias";
moduleAlias.addAliases({
  "@api": `${__dirname}/api`,
  "@configs": `${__dirname}/configs`,
  "@controllers": `${__dirname}/controllers`,
  "@interfaces": `${__dirname}/interfaces`,
  "@middleware": `${__dirname}/middleware`,
  "@validator": `${__dirname}/middleware/validators`,
  "@models": `${__dirname}/models`,
  "@providers": `${__dirname}/providers`,
  "@services": `${__dirname}/services`,
  "@utils": `${__dirname}/utils`
});

import * as dotenv from 'dotenv';
dotenv.config();


// SERVET Start and Load balancer --> Next staging is loadbalancer
import App from "./app";
import ConnectionDB from './configs/database';

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