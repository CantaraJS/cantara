/// <reference types="socket.io-client" />
import { SetupDivaChatParams } from './public';
/**
 * ENV data available to all stores
 */
export interface EnvData extends SetupDivaChatParams {
    socket: SocketIOClient.Socket;
}
export declare function setupEnv(setupData: SetupDivaChatParams): void;
export declare function getEnv(): EnvData;
//# sourceMappingURL=env.d.ts.map