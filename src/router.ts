import { Response } from "./response";
import { Request } from "./request";

export type RouteHandler = (req: Request, res: Response, params?: { [key: string]: string }) => Promise<void>;
export type Middleware = (req: Request, res: Response, next: () => Promise<void>) => Promise<void>;


export interface Route {
    method: string;
    path: string;
    handler: RouteHandler;
}

export class Router {

    private static readonly VALID_METHODS = new Set(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']);
    private prefix: string;
    private routes: Route[] = [];
    private middlewares: Middleware[] = [];

    constructor(prefix: string = '') {
        this.prefix = prefix;
    }

    use(middleware: Middleware): void {
        this.middlewares.push(middleware);
    }

    getRoutes(): Route[] {
        return this.routes;
    }

    getMiddlewares(): Middleware[] {
        return this.middlewares;
    }

    private addRoute(method: string, path: string, handler: RouteHandler): void {
        const normalizedMethod = method.toUpperCase();

        if (!Router.VALID_METHODS.has(normalizedMethod)) {
            throw new Error(`Invalid HTTP method: ${method}`);
        }

        const fullPath = this.prefix + path;
        this.routes.push({ method: normalizedMethod, path: fullPath, handler });
    }

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

}
