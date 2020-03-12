import { TOnlineStatus, TChatMessage, TChat } from '..';
export declare const SOCKET_EVENT_AUTH = "auth";
export interface SocketEventAuthPayload {
    jwt: string;
    channelId?: string;
    organizationId?: string;
}
export declare const SOCKET_EVENT_CONSULTANTS_LIST_UPADATE = "consultants_list_update";
export declare type SocketEventConsultantsListUpdatePayload = string[];
export declare const SOCKET_EVENT_ONLINE_STATUS_CHANGED = "online_status_changed";
export interface SocketEventOnlineStatusChangedPayload {
    userId: string;
    newOnlineStatus: TOnlineStatus;
}
export declare const SOCKET_EVENT_ON_NEW_MESSAGE: (chatId: string) => string;
export declare type SocketEventOnNewMessagePayload = TChatMessage;
export declare const SOCKET_EVENT_ON_MESSAGE_CHANGE: (chatId: string) => string;
export declare type SocketEventOnMessageChangedPayload = TChatMessage;
export declare const SOCKET_EVENT_DESIGN_URL_CHANGE: (chatId: string) => string;
export declare type SocketEventOnDesignUrlChangedPayload = string;
export declare const SOCKET_EVENT_ON_PARTICIPANT_ADDED: (chatId: string) => string;
export declare type SocketEventOnParticipantAddedChangedPayload = string;
export declare const SOCKET_EVENT_ON_JOIN_REQUEST: (chatId: string) => string;
export interface SocketEventOnJoinRequestPayload {
    chatId: string;
    userId: string;
}
export declare const SOCKET_EVENT_ON_JOIN_REQUEST_REACTION: (chatId: string) => string;
export interface SocketEventOnJoinRequestReactionPayload {
    chatId: string;
    consultantId: string;
    canJoin: boolean;
}
export declare const SOCKET_EVENT_GET_USER_ONLINE_STATUS = "get_user_online_status";
export interface SocketEventGetUserOnlineStatusPayload {
    userId: string;
}
export declare const SOCKET_EVENT_SEND_MESSAGE = "send_message";
export interface SocketEventSendMessagePayload {
    chatId: string;
    content: string;
}
export declare const SOCKET_EVENT_SET_MESSAGE_AS_READ = "set_message_as_read";
export interface SocketEventSetMessageAsReadPayload {
    chatId: string;
    messageId: string;
}
export declare const SOCKET_EVENT_UPDATE_DESIGN_URL = "update_design_url";
export interface SocketEventUpdateDesignUrlPayload {
    chatId: string;
    newDesignUrl: string;
}
export declare const SOCKET_EVENT_JOIN_REQUEST = "join_request";
export declare const SOCKET_EVENT_REACT_TO_JOIN_REQUEST = "react_to_join_request";
export declare const SOCKET_EVENT_CREATE_NEW_CHAT = "create_new_chat";
export interface SocketEventCreateNewChatPayload {
    clientId: string;
    /**
     * ID of consultant the user
     * wants to talk with.
     */
    partnerId?: string;
    divaNr?: string;
    /**
     * If there's an active chat going on currently,
     * Create a new chat with the same participants
     * but a new diva Nr. Copy all messages from
     * the old chat to the new chat. */
    copyFromId?: string;
}
export declare const SOCKET_EVENT_ADD_PARTICIPANT = "add_participant";
export interface SocketEventAddParticipantPayload {
    /**
     * User who triggered the update
     */
    userIdToAdd: string;
    chatId: string;
}
export declare const SOCKET_EVENT_ON_CHATS_HYDRATE = "on_chats_hydrate";
export interface SocketEventOnChatsHydratePayload {
    chats: TChat;
}
export declare const SOCKET_EVENT_ON_CHAT_CREATED = "on_chat_created";
export declare type SocketEventOnChatCreatedPayload = TChat;
export declare const SOCKET_EVENT_GET_USER_BY_ID = "get_user_by_id";
//# sourceMappingURL=index.d.ts.map