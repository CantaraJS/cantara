interface BuildChangedParam {
    stage: string;
}
export default function buildChanged({ stage }: BuildChangedParam): Promise<void>;
export {};
