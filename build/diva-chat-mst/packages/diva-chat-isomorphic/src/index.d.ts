import { SnapshotOrInstance } from 'mobx-state-tree';
export declare const ChatMessageStateModel: import("mobx-state-tree").IModelType<{
    _id: import("mobx-state-tree").ISimpleType<string>;
    content: import("mobx-state-tree").ISimpleType<string>;
    sender: import("mobx-state-tree").ISimpleType<string>;
    sentAt: import("mobx-state-tree").ISimpleType<number>;
    readBy: import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>;
}, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export declare const JoinRequestStateModel: import("mobx-state-tree").IModelType<{
    consultantId: import("mobx-state-tree").ISimpleType<string>;
    status: import("mobx-state-tree").ISimpleType<"PENDING" | "ACCEPTED" | "REJECTED">;
    expiresAt: import("mobx-state-tree").ISimpleType<number>;
}, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export declare const ChatStateModel: import("mobx-state-tree").IModelType<{
    _id: import("mobx-state-tree").ISimpleType<string>;
    messages: import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
        _id: import("mobx-state-tree").ISimpleType<string>;
        content: import("mobx-state-tree").ISimpleType<string>;
        sender: import("mobx-state-tree").ISimpleType<string>;
        sentAt: import("mobx-state-tree").ISimpleType<number>;
        readBy: import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    participants: import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>;
    divaNr: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<string>, [undefined]>;
    designUrl: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<string>, [undefined]>;
    createdBy: import("mobx-state-tree").ISimpleType<string>;
    updatedAt: import("mobx-state-tree").ISimpleType<number>;
    jointRequests: import("mobx-state-tree").IArrayType<import("mobx-state-tree").IModelType<{
        consultantId: import("mobx-state-tree").ISimpleType<string>;
        status: import("mobx-state-tree").ISimpleType<"PENDING" | "ACCEPTED" | "REJECTED">;
        expiresAt: import("mobx-state-tree").ISimpleType<number>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
    channelId: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<string>, [undefined]>;
    organizationId: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<string>, [undefined]>;
    /**
     * If a chat was copied from another one
     * (divaNr transition) this is set to the
     * ID of the "old" chat
     */
    copyFrom: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<string>, [undefined]>;
}, {
    addMessage(msg: {
        _id: string;
        content: string;
        sender: string;
        sentAt: number;
        readBy: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>>;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        _id: import("mobx-state-tree").ISimpleType<string>;
        content: import("mobx-state-tree").ISimpleType<string>;
        sender: import("mobx-state-tree").ISimpleType<string>;
        sentAt: import("mobx-state-tree").ISimpleType<number>;
        readBy: import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>): void;
    getMessageById(id: string): ({
        _id: string;
        content: string;
        sender: string;
        sentAt: number;
        readBy: import("mobx-state-tree").IMSTArray<import("mobx-state-tree").ISimpleType<string>> & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>>;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        _id: import("mobx-state-tree").ISimpleType<string>;
        content: import("mobx-state-tree").ISimpleType<string>;
        sender: import("mobx-state-tree").ISimpleType<string>;
        sentAt: import("mobx-state-tree").ISimpleType<number>;
        readBy: import("mobx-state-tree").IArrayType<import("mobx-state-tree").ISimpleType<string>>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>) | undefined;
    isUserParticipant(userId: string): boolean;
} & {
    /**
     * "Local" means that it just
     * mutates the local state of
     * model with no additonal
     * side effect.
     */
    setMessageAsReadByLocal(readByUserId: string, messageId: string): void;
    setDesignUrlLocal(newDesignUrl: string): void;
    addParticipantLocal(newParticipant: string): void;
    reactToJoinRequestLocal(consultantId: string, canJoin: boolean): void;
    /**
     * Consultant wants to join
     */
    sendJoinRequestLocal(myUserId: string): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export { default as UserStateBaseModel } from './UserStateBaseModel';
export * from './UserStateBaseModel';
export * from './socket-events';
export declare type TOnlineStatus = 'ONLINE' | 'OFFLINE';
export declare type TChatMessage = SnapshotOrInstance<typeof ChatMessageStateModel>;
export declare type TChat = SnapshotOrInstance<typeof ChatStateModel>;
//# sourceMappingURL=index.d.ts.map