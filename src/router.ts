import { IncomingMessage, ServerResponse } from 'http';

type RouteHandler = (req: IncomingMessage, res: ServerResponse, params: { [key: string]: string }) => void;


export class Router {
    private routes: Map<string, RouteHandler>;

    constructor() {
        this.routes = new Map();
    }

    public addRoute(path: string, handler: RouteHandler): void {
        this.routes.set(path, handler);
    }

    public route(req: IncomingMessage, res: ServerResponse): void {
        const routeMatch = this.matchRoute(req.url || '');
        if (routeMatch) {
            const { handler, params } = routeMatch;
            handler(req, res, params);
        } else {
            res.statusCode = 404;
            res.end('Not Found');
        }
    }
    

    public matchRoute(reqUrl: string): { handler: RouteHandler, params: { [key: string]: string } } | undefined {
        for (let [path, handler] of this.routes.entries()) {
            const pathParts = path.split('/');
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
                    return { handler, params };
                }
            }
        }
    }
    
}
