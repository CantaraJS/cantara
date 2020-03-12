export default function doSomethingUseful(): {
    msg: string;
    create: () => {
        msg: string;
    } & import("mobx-state-tree/dist/internal").NonEmptyObject & import("mobx-state-tree").IStateTreeNode<import("mobx-state-tree").IModelType<{
        msg: import("mobx-state-tree").ISimpleType<string>;
    }, {}, import("mobx-state-tree")._NotCustomized, import("mobx-state-tree")._NotCustomized>>;
};
//# sourceMappingURL=index.d.ts.map