import { SnapshotOrInstance } from 'mobx-state-tree';
import { TOnlineStatus } from 'diva-chat-isomorphic';
import LocalChatStateModel from './LocalChatStateModel';
import UserModel from './UserModel';
export declare type TChat = SnapshotOrInstance<typeof LocalChatStateModel>;
export declare type TChatUser = SnapshotOrInstance<typeof UserModel>;
export declare type TChatRoles = 'CLIENT' | 'CONSULTANT';
export interface OnOnlineStatusChangeEvent {
    userId: string;
    newOnlineStatus: TOnlineStatus;
}
export interface CreateNewChatParams {
    partnerId?: string;
    divaNr?: string;
}
//# sourceMappingURL=types.d.ts.map