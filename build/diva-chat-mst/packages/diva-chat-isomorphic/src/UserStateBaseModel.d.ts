import { SnapshotOrInstance } from 'mobx-state-tree';
declare const UserStateBaseModel: import("mobx-state-tree").IModelType<{
    _id: import("mobx-state-tree").ISimpleType<string>;
    role: import("mobx-state-tree").ISimpleType<"CONSULTANT" | "CLIENT">;
    onlineStatus: import("mobx-state-tree").ISimpleType<"ONLINE" | "OFFLINE">;
    name: import("mobx-state-tree").ISimpleType<string>;
    picture: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<string>, [undefined]>;
    channelId: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<string>, [undefined]>;
    organizationId: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<string>, [undefined]>;
}, {
    updateOnlineStatus(newStatus: "ONLINE" | "OFFLINE"): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export declare type TUserStateBaseModel = SnapshotOrInstance<typeof UserStateBaseModel>;
export default UserStateBaseModel;
//# sourceMappingURL=UserStateBaseModel.d.ts.map