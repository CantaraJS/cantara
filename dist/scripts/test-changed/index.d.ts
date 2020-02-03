interface TestChangedParam {
    stage: string;
}
export default function testChanged({ stage }: TestChangedParam): Promise<void>;
export {};
