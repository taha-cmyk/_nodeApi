import { Application } from "./application";
import { Request } from "./request";
import { Response } from "./response";
import { Router } from "./router";

async function fetchData(url: string): Promise<any> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
}


const apiURL = 'https://jsonplaceholder.typicode.com/posts'; 

const posts = new Router("/posts");

posts.get("", async (req:Request,res:Response)=>{

    let data = fetchData(apiURL)
        .then(data => res.sendJson(data))
        .catch(error => res.sendJson({"error":error}));

});

posts.post("", async (req:Request,res:Response)=>{

    let data = await req.getBody();

    res.sendJson(data);

});
const app = new Application();


app.addRoute("get","/users/:id/:role",async (req:Request,res:Response,params)=>{
    res.sendJson({"params":params});
});

posts.use(async (req:Request,res:Response,next)=>{
    console.log(`${req.method} ${req.url} [${new Date()}] `);
    await next();
})




app.useRouter(posts);



app.listen(3000, () => {
    console.log('Server running on port 3000');
});

