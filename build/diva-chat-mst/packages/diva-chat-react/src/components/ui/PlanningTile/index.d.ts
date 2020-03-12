import React, { ReactNode } from 'react';
interface Props {
    /** background image URL */
    image?: string;
    badge?: ReactNode;
    onClick?: () => void;
    active?: boolean;
    displayName?: string;
    newMessages?: number;
    disabled?: boolean;
}
declare const PlanningTile: React.FC<Props>;
export default PlanningTile;
//# sourceMappingURL=index.d.ts.map