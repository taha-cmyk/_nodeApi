import { Application } from "./application";
import { Request } from "./request";
import { Response } from "./response";
import { Router } from "./router";
import { MessageBroadcaster } from "./messageBroadcaster";

const payments = new Router("/payments");

let message_broadcater = new MessageBroadcaster("/payment-done");

message_broadcater.setHosts([
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
]);

payments.post("/checkout", async (req:Request,res:Response)=>{
    // some logic 

    // all succuss
    await message_broadcater.sendAll().then().catch();
    res.sendJson({"message":"payment done"});

});


const app = new Application();

app.use(async (req:Request,res:Response,next)=>{
    console.log(`${req.method} ${req.url} [${new Date()}] `);
    await next();
})

app.useRouter(payments);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

