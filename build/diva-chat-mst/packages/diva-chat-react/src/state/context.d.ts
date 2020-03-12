import React from 'react';
import { Instance } from 'mobx-state-tree';
import RootStore from '.';
import { SetupDivaChatParams } from './public';
interface IProviderValue {
    rootStore: Instance<typeof RootStore>;
}
export declare const MSTProvider: React.FC<SetupDivaChatParams>;
export declare function useMst(): IProviderValue;
export {};
//# sourceMappingURL=context.d.ts.map