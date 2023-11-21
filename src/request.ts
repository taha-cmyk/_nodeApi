import { IncomingMessage } from 'http';
import { parse as parseUrl } from 'url';
import { parse as parseQuery } from 'querystring';

export class Request {
    private request: IncomingMessage;
    private bodyParsed: boolean = false;
    private _body: any;

    constructor(request: IncomingMessage) {
        this.request = request;
    }

    get headers(): NodeJS.Dict<string | string[]> {
        return this.request.headers;
    }

    get url(): string | undefined {
        return this.request.url;
    }

    get method(): string | undefined {
        return this.request.method;
    }

    get query(): any {
        if (this.url) {
            return parseQuery(parseUrl(this.url, true).query as any);
        }
        return {};
    }

    async getBody(): Promise<any> {
        if (this.bodyParsed) {
            return this._body;
        }

        return new Promise((resolve, reject) => {
            let data = '';
            this.request.on('data', chunk => {
                data += chunk;
            });
            this.request.on('end', () => {
                try {
                    this._body = JSON.parse(data);
                    this.bodyParsed = true;
                    resolve(this._body);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}


