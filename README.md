# nodeapi
 micro framework for learning

 > working only with api and json responsess

 > this is only for learnig purposes

# flexibility 
work with your best  pacakges such us ORMs , db clients and more

# Example 
the npm package is not available for now , comming soon


```typescript

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

app.useRouter(posts);


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

# add Middlewares

```typescript
posts.use(async (req:Request,res:Response,next)=>{
    console.log(`${req.method} ${req.url} [${new Date()}] `);
    await next();
})
```

# http methods
```typescript
    get(path: string, handler: RouteHandler): void {
        this.addRoute('GET', path, handler);
    }

    post(path: string, handler: RouteHandler): void {
        this.addRoute('POST', path, handler);
    }

    put(path: string, handler: RouteHandler): void {
        this.addRoute('PUT', path, handler);
    }

    delete(path: string, handler: RouteHandler): void {
        this.addRoute('DELETE', path, handler);
    }
```




