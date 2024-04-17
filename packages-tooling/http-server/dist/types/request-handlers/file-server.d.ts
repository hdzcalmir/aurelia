import { IRequestHandler, IHttp2FileServer } from '../interfaces';
import { IHttpContext } from '../http-context';
export declare class FileServer implements IRequestHandler {
    private readonly root;
    private readonly cacheControlDirective;
    private readonly opts;
    private readonly logger;
    constructor();
    handleRequest(context: IHttpContext): Promise<void>;
}
/**
 * File server with HTTP/2 push support
 */
export declare class Http2FileServer implements IHttp2FileServer {
    private readonly cacheControlDirective;
    private readonly root;
    private readonly filePushMap;
    private readonly opts;
    private readonly logger;
    constructor();
    handleRequest(context: IHttpContext): void;
    private pushAll;
    private push;
    private prepare;
    private getPushInfo;
}
//# sourceMappingURL=file-server.d.ts.map