"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Takes a template and variables in the form of "<--VARIABLE_NAME-->" and replaces
 * all variables with the values passed */
function renderTemplate({ template, variables, }) {
    const variablesNames = Object.keys(variables);
    let renderedTemplate = template;
    for (const varName of variablesNames) {
        const varValue = variables[varName];
        const replaceVal = `<--${varName}-->`;
        renderedTemplate = renderedTemplate.replace(new RegExp(replaceVal, 'g'), varValue.toString());
    }
    return renderedTemplate;
}
exports.default = renderTemplate;
