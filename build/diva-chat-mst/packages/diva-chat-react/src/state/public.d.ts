/**
 * Publicly available functions
 * to initialize/access/modify application
 * state
 */
export interface SetupDivaChatParams {
    /** URL to realtime API server */
    apiUrl: string;
    currentUserId?: string;
    jwt?: string;
    /** Called when the number of unread
     * messages changes. Can be used
     * for notifications.
     */
    onUnreadMessages?: (unreadMessagesCount: number) => void;
    channelId?: string;
    organizationId?: string;
}
export declare function useDivaChat(): {
    isChatModalVisible: boolean;
};
//# sourceMappingURL=public.d.ts.map