interface GetAllWebpackExternalsOptions {
    peerOnly?: boolean;
}
/** Makes sure that all package dependencies
 * are externalized (not included in bundle).
 * Reads every packageJson provided and adds
 * each dependency to the list.
 * If `peerOnly` is set to `true`, only peer
 * dependecies are excluded. Useful for
 * CDN bundles.
 */
export default function getAllWebpackExternals({ peerOnly, }?: GetAllWebpackExternalsOptions): (_: any, request: string, callback: (err?: string | null | undefined, module?: string | undefined) => void) => void;
export {};
