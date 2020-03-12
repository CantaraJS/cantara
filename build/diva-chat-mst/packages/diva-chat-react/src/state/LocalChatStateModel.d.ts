/**
 * Extends the global chat state model
 * and adds dome methods and lifecycle hooks
 */
declare const LocalChatStateModel: import("mobx-state-tree").IModelType<{
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
    setMessageAsReadByLocal(readByUserId: string, messageId: string): void;
    setDesignUrlLocal(newDesignUrl: string): void;
    addParticipantLocal(newParticipant: string): void;
    reactToJoinRequestLocal(consultantId: string, canJoin: boolean): void;
    sendJoinRequestLocal(myUserId: string): void;
} & {
    sendMessage(content: string): void;
    setMessageAsRead(messageId: string): void;
    updateDesignUrl(newDesignUrl: string): void;
    sendJoinRequest(): void;
    reactToJoinRequest(consultantId: string, canJoin: boolean): void;
    addParticipant(userIdToAdd: string): void;
    /**
     * Setup event listeners
     */
    afterCreate(): void;
} & {
    readonly unreadMessages: number;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export default LocalChatStateModel;
//# sourceMappingURL=LocalChatStateModel.d.ts.map