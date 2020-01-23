interface InitializeNewProjectOptions {
    /** name of new project.
     * Will be derived from folder
     * name if not specified.
     */
    projectName?: string;
    /** Root of user's project */
    projectDir: string;
    /** Name of template. If no github username is specified,
     * it will be resolved to "scriptify/<template-name>".
     * A link can also be passed.
     */
    templateName: string;
}
export default function initializeNewProject({ projectDir, templateName, }: InitializeNewProjectOptions): Promise<void>;
export {};
