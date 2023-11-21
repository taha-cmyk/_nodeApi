import { Server, IncomingMessage, ServerResponse, createServer } from 'http';
import { Response } from './response';
import { Request } from './request';

type RouteHandler = (req: Request, res: Response, params?: { [key: string]: string }) => void;
type Middleware = (req: Request, res: Response, next: () => void) => void;

interface Route {
    method: string;
    path: string;
    handler: RouteHandler;
}

export class Application {
    private server?: Server;
    routes: Route[] = [];
    middlewares: Middleware[] = [];

    constructor() {
        this.server = createServer((req:IncomingMessage , res:ServerResponse) => {

            this.handleRequest(req as Request, res as Response);
        });
    }

    use(middleware: Middleware): void {
        this.middlewares.push(middleware);
    }

    addRoute(method: string, path: string, handler: RouteHandler): void {
        this.routes.push({ method, path, handler });
    }

    private handleRequest(req: Request, res:Response): void {
        let middlewareIndex = 0;

        const next = () => {
            if (middlewareIndex < this.middlewares.length) {
                const middleware = this.middlewares[middlewareIndex++];
                middleware(req, res, next);
            } else {
                this.handleRoute(req, res);
            }
        };

        next();
    }

    private handleRoute(req: Request, res:Response): void {
        const requestedPath = req.url || '';
        const requestedMethod = req.method || '';
    
        const routeMatch = this.matchRoute(requestedPath, requestedMethod);
        if (routeMatch) {
            const { handler, params } = routeMatch;
            handler(req, res, params);
        } else {
            res.statusCode = 404;
            res.end('Not Found');
        }
    }
    


    private matchRoute(reqUrl: string, reqMethod: string): { handler: RouteHandler, params: { [key: string]: string } } | undefined {
        for (let route of this.routes) {
            if (route.method !== reqMethod) {
                continue;
            }
    
            const pathParts = route.path.split('/');
            const urlParts = reqUrl.split('/');
            const params: { [key: string]: string } = {};
    
            if (pathParts.length === urlParts.length) {
                const isMatch = pathParts.every((part, index) => {
                    if (part.startsWith(':')) {
                        params[part.substring(1)] = urlParts[index];
                        return true;
                    }
                    return part === urlParts[index];
                });
    
                if (isMatch) {
                    return { handler: route.handler, params };
                }
            }
        }
    }
    

    listen(port: number, callback?: () => void): void {
        this.server?.listen(port, callback);
    }
}


