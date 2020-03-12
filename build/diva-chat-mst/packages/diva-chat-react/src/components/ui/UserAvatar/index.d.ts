import React from 'react';
import { TOnlineStatus } from 'diva-chat-isomorphic';
declare type AvatarSize = 'small' | 'medium' | 'big' | 'huge';
interface Props {
    /** Size defaults to small */
    size?: AvatarSize;
    src?: string;
    style?: React.CSSProperties;
    onlineStatus?: TOnlineStatus;
    onClick?: () => void;
    loading?: boolean;
}
export declare const USER_AVATAR_SIZES: {
    small: number;
    medium: number;
    big: number;
    huge: number;
};
declare const UserAvatar: React.FC<Props>;
export default UserAvatar;
//# sourceMappingURL=index.d.ts.map