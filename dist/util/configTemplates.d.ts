interface RenderTemplateOptions {
    template: string;
    variables: {
        [key: string]: string | number | boolean;
    };
}
/** Takes a template and variables in the form of "<--VARIABLE_NAME-->" and replaces
 * all variables with the values passed */
export default function renderTemplate({ template, variables, }: RenderTemplateOptions): string;
export {};
