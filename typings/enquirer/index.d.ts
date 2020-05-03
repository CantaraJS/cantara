declare module 'enquirer' {
  interface AutoCompleteConstructor {
    multiple?: boolean;
    initial?: number;
    footer?: (obj: AutoComplete) => string;
    limit?: number;
    choices: string[];
    name: string;
    message?: string;
  }

  interface StringPromptConstructor {
    message: string;
    footer?: string;
    header?: string;
  }

  class PromptBaseClass {
    public run(): Promise<string>;
  }

  export class AutoComplete extends PromptBaseClass {
    public constructor(o: AutoCompleteConstructor);

    public index: number;
  }

  export class StringPrompt extends PromptBaseClass {
    public constructor(o: StringPromptConstructor);
  }
}
