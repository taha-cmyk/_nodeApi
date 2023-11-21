import { IncomingMessage, ServerResponse } from 'http';

export class Response extends ServerResponse {

    json(data: any): void {
        this.setHeader('Content-Type', 'application/json');
        this.end(JSON.stringify(data));
    }
}
