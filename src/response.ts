import { ServerResponse } from 'http';

export class Response {
    private response: ServerResponse;

    constructor(response: ServerResponse) {
        this.response = response;
    }

    setHeader(name: string, value: string): this {
        this.response.setHeader(name, value);
        return this;
    }

    status(code: number): this {
        this.response.statusCode = code;
        return this;
    }

    send(data: string): void {
        this.response.end(data);
    }

    sendJson(data: object): void {
        this.setHeader('Content-Type', 'application/json');
        this.response.end(JSON.stringify(data));
    }
}

