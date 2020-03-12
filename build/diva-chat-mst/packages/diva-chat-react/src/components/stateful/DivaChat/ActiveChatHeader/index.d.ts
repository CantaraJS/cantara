import React from 'react';
import { TOnlineStatus } from 'diva-chat-isomorphic';
interface Props {
    currentUserAvatar: string;
    chatTitle?: string;
    partner?: {
        avatar: string;
        onlineStatus: TOnlineStatus;
        fullName: string;
    };
}
declare const ActiveChatHeader: React.FC<Props>;
export default ActiveChatHeader;
//# sourceMappingURL=index.d.ts.map