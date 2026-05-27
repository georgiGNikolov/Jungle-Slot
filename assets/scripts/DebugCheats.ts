import { MockApi, PAYLINES } from './MockApi';

// Filler symbols vary per column so single-payline cheats don't accidentally
// chain a 3+ match on any other line. No wilds (id 0) in any filler position.
const FILLERS = [
    [5, 9, 5, 9, 5],
    [6, 8, 6, 8, 6],
    [7, 5, 7, 5, 7],
    [8, 6, 8, 6, 8],
    [9, 7, 9, 7, 9],
];

function buildLineWin(lineNums: number[], symbol = 1): number[][] {
    return Array.from({ length: 5 }, (_, col) => {
        const reel = [...FILLERS[col]];

        for (const n of lineNums) {
            const physicalRow = PAYLINES[n - 1].rows[col] + 1;
            reel[physicalRow] = symbol;
        }

        return reel;
    });
}

function fillAllVisible(symbol: number): number[][] {
    return Array.from({ length: 5 }, () => [9, symbol, symbol, symbol, 9]);
}

export function installDebugCheats() {
    if (typeof window === 'undefined') return;
    (window as any).debug = {
        line1: () => MockApi.forceNext(buildLineWin([1])),
        line2: () => MockApi.forceNext(buildLineWin([2])),
        line3: () => MockApi.forceNext(buildLineWin([3])),
        line4: () => MockApi.forceNext(buildLineWin([4])),
        line5: () => MockApi.forceNext(buildLineWin([5])),
        line6: () => MockApi.forceNext(buildLineWin([6])),
        line7: () => MockApi.forceNext(buildLineWin([7])),
        line8: () => MockApi.forceNext(buildLineWin([8])),
        line9: () => MockApi.forceNext(buildLineWin([9])),
        line10: () => MockApi.forceNext(buildLineWin([10])),
        allLines: () => MockApi.forceNext(fillAllVisible(1)),
        maxWin: () => MockApi.forceNext(fillAllVisible(0)),
        noWin: () => MockApi.forceNext([
            [9, 1, 2, 3, 9], [9, 2, 3, 4, 9], [9, 3, 4, 5, 9],
            [9, 4, 5, 6, 9], [9, 5, 6, 7, 9],
        ])
    };
    console.log("[Debug] Cheats available: window.debug.{line1..line10, allLines, maxWin, noWin}");
}
