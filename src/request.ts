import { IncomingMessage } from 'http';
import { parse as parseUrl } from 'url';
import { ParsedUrlQuery } from 'querystring';
import { parse as parseCookie  } from 'cookie';

export class Request extends IncomingMessage {

    private _cookies?: Record<string,string>;
    private _query?: ParsedUrlQuery;
    public params: { [key: string]: string } = {};

    get cookies(): Record<string,string> {
        if (!this._cookies) {
            this._cookies = parseCookie(this.headers.cookie || '');
        }
        return this._cookies;
    }

    get query(): ParsedUrlQuery {
        if (!this._query) {
            const urlObj = parseUrl(this.url || '', true);
            this._query = urlObj.query;
        }
        return this._query;
    }

    
}
