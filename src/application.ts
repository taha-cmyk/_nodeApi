import { Server, IncomingMessage, ServerResponse, createServer } from 'http';
import { Response } from './response';
import { Request } from './request';
import { Router ,Route,RouteHandler,Middleware} from './router';



export class Application {

    private static readonly VALID_METHODS = new Set(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']);
    private server?: Server;
    routes: Route[] = [];
    middlewares: Middleware[] = [];

    constructor() {
        this.server = createServer((req:IncomingMessage , res:ServerResponse) => {
            this.handleRequest(new Request(req) , new Response(res) );
        });
    }

    use(middleware: Middleware): void {
        this.middlewares.push(middleware);
    }

    useRouter(router: Router): void {
        const routerRoutes = router.getRoutes();
        const routerMiddlewares = router.getMiddlewares();
        this.routes.push(...routerRoutes);
        this.middlewares.push(...routerMiddlewares);
    }

    addRoute(method: string, path: string, handler: RouteHandler): void {
        const normalizedMethod = method.toUpperCase();

        if (!Application.VALID_METHODS.has(normalizedMethod)) {
            throw new Error(`Invalid HTTP method: ${method}`);
        }

        this.routes.push({ method: normalizedMethod, path, handler });
    }

    private async handleRequest(req: Request, res: Response): Promise<void> {
        let middlewareIndex = 0;

        const next = async () => {
            if (middlewareIndex < this.middlewares.length) {
                const middleware = this.middlewares[middlewareIndex++];
                await middleware(req, res, next);
            } else {
                await this.handleRoute(req, res);
            }
        };

        await next();
    }


  private async handleRoute(req: Request, res: Response): Promise<void> {
        const requestedPath = req.url || '';
        const requestedMethod = req.method || '';

        const routeMatch = this.matchRoute(requestedPath, requestedMethod);
        if (routeMatch) {
            const { handler, params } = routeMatch;
            await handler(req, res, params);
        } else {
            res.status(404);
            res.send('Not Found');
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


