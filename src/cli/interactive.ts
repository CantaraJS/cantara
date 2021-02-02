import { AutoComplete, StringPrompt, StringPromptConstructor } from 'enquirer';
import c from 'ansi-colors';

import { CantaraCommand } from './commands';
import { LiveLinkedPackageSuggestion } from '../util/types';

interface StartCantaraInteractiveMode {
  availableCommands: CantaraCommand[];
}

/**
 * Executed when cantara is invoked
 * without any parameters. It's an UI
 * to build the final Cantara
 * command which is to be executed
 */
export async function cantaraInteractiveMode({
  availableCommands,
}: StartCantaraInteractiveMode) {
  const cmdChoices = availableCommands.map((cmd) => cmd.name);
  const prompt = new AutoComplete({
    name: 'Command',
    message: 'Which command do you want to execute?',
    initial: 0,
    choices: cmdChoices,
    footer: (prompt) => {
      return '\n' + c.black.bgCyan(availableCommands[prompt.index].description);
    },
  });
  let newCmd = await prompt.run();
  const foundCmdObj = availableCommands[prompt.index];
  if (foundCmdObj.parameters) {
    for (const cmdParam of foundCmdObj.parameters) {
      let prompt: AutoComplete | StringPrompt | null = null;
      if (cmdParam.choices) {
        prompt = new AutoComplete({
          name: cmdParam.name,
          message: cmdParam.description,
          initial: 0,
          choices: [...cmdParam.choices],
        });
      } else {
        prompt = new StringPrompt({
          message: cmdParam.description,
        });
      }

      const params = await prompt.run();
      if (params) {
        newCmd = `${newCmd} ${params}`;
      }
    }
  }
  return newCmd;
}

interface ChooseApplicationParams {
  availableAppNames: string[];
}

/**
 * Let user interactively choose an application/package
 */
export function chooseApplication({
  availableAppNames,
}: ChooseApplicationParams) {
  const prompt = new AutoComplete({
    name: 'Appname',
    message: 'Pick an application/package',
    initial: 0,
    choices: availableAppNames,
  });
  return prompt.run();
}

/**
 * Returns absolute path to package
 */
export async function chooseLiveLinkPackage(
  liveLinkSuggestions: LiveLinkedPackageSuggestion[],
) {
  const availablePackages = liveLinkSuggestions.map(
    (liveLinkPackage) => liveLinkPackage.packageRoot,
  );
  const beatifulPackageNames = liveLinkSuggestions.map(
    (liveLinkPackage) =>
      `${liveLinkPackage.packageName} (-> ${liveLinkPackage.projectRoot})`,
  );
  const prompt = new AutoComplete({
    name: 'Appname',
    message: 'Pick a package',
    initial: 0,
    choices: beatifulPackageNames,
  });
  const chosen = await prompt.run();
  const packagePath = availablePackages[beatifulPackageNames.indexOf(chosen)];
  return packagePath;
}

export function stringPrompt(options: StringPromptConstructor) {
  const prompt = new StringPrompt(options);
  return prompt.run();
}
