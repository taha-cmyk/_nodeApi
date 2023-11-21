import { Application } from "./application";
import { Request } from "./request";
import { Response } from "./response";

const app = new Application();

// Middleware example
app.use((req:Request, res:Response, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

app.use

app.addRoute('GET', '/data', (req:Request, res:Response) => {
    const data = { message: 'Hello, world!' };
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));

    // res.json(data); not working
});

app.addRoute('GET', '/user/:id', (req:Request, res:Response, params) => {
    res.end(`User ID: ${params?.id}`);
});

app.addRoute('GET', '/user/:id/:role', (req:Request, res:Response, params) => {
    res.end(`User ID: ${params?.id} ${params?.role}`);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

