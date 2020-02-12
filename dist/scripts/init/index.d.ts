interface InitializeNewProjectOptions {
    /** Optional absolute path/name of new folder */
    newFolderPath?: string;
    /** Name of template. If no github username is specified,
     * it will be resolved to "CantaraJS/<template-name>".
     * A link can also be passed.
     */
    templateName: string;
}
export default function initializeNewProject({ newFolderPath, templateName, }: InitializeNewProjectOptions): Promise<void>;
export {};
