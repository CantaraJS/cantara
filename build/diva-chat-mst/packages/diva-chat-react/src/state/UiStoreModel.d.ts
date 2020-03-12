declare const UiStoreModel: import("mobx-state-tree").IModelType<{
    activeChatId: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<string>, [undefined]>;
    isChatModalVisible: import("mobx-state-tree").IOptionalIType<import("mobx-state-tree").ISimpleType<boolean>, [undefined]>;
}, {
    setActiveChat: (id: string) => void;
    toggleChatModal(): void;
}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>;
export default UiStoreModel;
//# sourceMappingURL=UiStoreModel.d.ts.map