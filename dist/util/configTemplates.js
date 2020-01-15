"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Takes a template and variables in the form of "<--VARIABLE_NAME-->" and replaces
 * all variables with the values passed */
function renderTemplate(_a) {
    var template = _a.template, variables = _a.variables;
    var variablesNames = Object.keys(variables);
    var renderedTemplate = template;
    for (var _i = 0, variablesNames_1 = variablesNames; _i < variablesNames_1.length; _i++) {
        var varName = variablesNames_1[_i];
        var varValue = variables[varName];
        var replaceVal = "<--" + varName + "-->";
        renderedTemplate = renderedTemplate.replace(new RegExp(replaceVal, 'g'), varValue.toString());
    }
    return renderedTemplate;
}
exports.default = renderTemplate;
