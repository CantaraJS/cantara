export default function parseDiffSummary(diffSum: string, projectDir: string): (false | {
    file: string;
    changes: number;
    insertions: number;
    deletions: number;
    binary: boolean;
} | {
    file: string;
    before: number;
    after: number;
    binary: boolean;
})[];
