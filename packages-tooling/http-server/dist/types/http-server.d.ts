import { IHttpServer, StartOutput } from './interfaces';
export declare class HttpServer implements IHttpServer {
    private server;
    private readonly logger;
    private readonly opts;
    private readonly container;
    private readonly handlers;
    start(): Promise<StartOutput>;
    stop(): Promise<void>;
    private handleRequest;
}
export declare class Http2Server implements IHttpServer {
    private server;
    private readonly logger;
    private readonly opts;
    private readonly container;
    private readonly http2FileServer;
    start(): Promise<StartOutput>;
    stop(): Promise<void>;
    private handleRequest;
}
//# sourceMappingURL=http-server.d.ts.map