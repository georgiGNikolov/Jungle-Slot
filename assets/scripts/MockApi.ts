export type InitData = {
    /** Mock game id. */
    gameId: string;

    /**
     * 5x5 starting layout (5 reels, 5 rows per column).
     * Row order top→bottom: [hiddenUpper, top, middle, bottom, hiddenLower].
     * Only rows 1..3 are on a payline; rows 0 and 4 are off-screen peeks.
     * Orientation is columns-first: defaultReels[col][row].
     */
    defaultReels: number[][];
};

export type PlayData = {
    /** Unique round id. */
    roundId: string;

    /**
     * Final landed result for this spin, columns-first: reels[col][row].
     * Each column has 5 rows: [hiddenUpper, top, middle, bottom, hiddenLower].
     * Wins are evaluated only on rows 1..3; rows 0 and 4 are decorative peeks.
     */
    reels: number[][];

    /** List of winning lines (empty if no win). */
    winLines: WinLine[];

    /** Sum of all line payouts in this result. */
    totalWin: number;
};

export type WinLine = {
    /** Id of the winning line */
    lineNumber: number;

    /** Payout for this single line. */
    winAmount: number;
    winIndexes: number[];
};

const REELS = 5;
const VISIBLE_ROWS = 3;
const TOTAL_ROWS = 5;
// Index of the first payline row within a 5-row column. Rows below this are payline rows (top/mid/bot).
const VISIBLE_ROW_OFFSET = 1;

const PLAY_DELAY_MS = 400;

/**
 * PAYLINES
 *
 * Row values:
 * 0 = top
 * 1 = middle
 * 2 = bottom
 */
export const PAYLINES: { lineNumber: number; rows: number[] }[] = [
    { lineNumber: 1, rows: [1, 1, 1, 1, 1] },
    { lineNumber: 2, rows: [0, 0, 0, 0, 0] },
    { lineNumber: 3, rows: [2, 2, 2, 2, 2] },
    { lineNumber: 4, rows: [0, 1, 2, 1, 0] },
    { lineNumber: 5, rows: [2, 1, 0, 1, 2] },
    { lineNumber: 6, rows: [0, 0, 1, 2, 2] },
    { lineNumber: 7, rows: [2, 2, 1, 0, 0] },
    { lineNumber: 8, rows: [1, 0, 0, 0, 1] },
    { lineNumber: 9, rows: [1, 2, 2, 2, 1] },
    { lineNumber: 10, rows: [2, 1, 2, 1, 2] },
];

/**
 * SYMBOL IDS
 *
 * 0 = Wild
 * 1 = H1
 * 2 = H2
 * 3 = H3
 * 4 = H4
 * 5 = L1
 * 6 = L2
 * 7 = L3
 * 8 = L4
 * 9 = L5
 */
const PAYTABLE: Record<number, Record<number, number>> = {
    0: { 3: 100, 4: 1000, 5: 2000 }, // Wild
    1: { 3: 50, 4: 500, 5: 1000 },   // H1
    2: { 3: 20, 4: 150, 5: 750 },    // H2
    3: { 3: 15, 4: 100, 5: 500 },    // H3
    4: { 3: 15, 4: 100, 5: 500 },    // H4
    5: { 3: 10, 4: 75, 5: 250 },     // L1
    6: { 3: 5, 4: 50, 5: 150 },      // L2
    7: { 3: 5, 4: 25, 5: 150 },      // L3
    8: { 3: 5, 4: 25, 5: 150 },      // L4
    9: { 3: 5, 4: 15, 5: 100 },      // L5
};

const WILD_SYMBOL = 0;

export class MockApi {
    private static initCallback: ((data: InitData) => void) | null = null;
    private static playCallback: ((data: PlayData) => void) | null = null;
    private static forcedNext: number[][] | null = null;

    public static onInitData(cb: (data: InitData) => void) {
        this.initCallback = cb;
    }

    public static onPlayResponse(cb: (data: PlayData) => void) {
        this.playCallback = cb;
    }

    /** Debug-only: force the next play() to return these reels instead of random. Consumed once. */
    public static forceNext(reels: number[][]) {
        this.forcedNext = reels;
        console.log("[Debug] Next play() will return:", reels);
    }

    public static init() {
        const data: InitData = {
            gameId: "999",

            // 5 reels x 5 rows [hiddenUpper, top, middle, bottom, hiddenLower]
            defaultReels: [
                [9, 1, 5, 7, 6],
                [5, 2, 6, 8, 9],
                [6, 3, 7, 9, 5],
                [7, 4, 8, 5, 6],
                [8, 1, 6, 9, 7],
            ],
        };

        this.initCallback?.(data);
    }

    public static play() {
        const reels = this.forcedNext ?? this.buildRandomReels();
        this.forcedNext = null;
        const winLines = this.evaluateWins(reels);

        const totalWin = winLines.reduce(
            (sum, wl) => sum + wl.winAmount,
            0
        );

        const payload: PlayData = {
            roundId: Date.now().toString(),
            reels,
            winLines,
            totalWin,
        };

        setTimeout(() => this.playCallback?.(payload), PLAY_DELAY_MS);
    }

    /**
     * Random symbol 0..9
     */
    private static randIcon(): number {
        return Math.floor(Math.random() * 10);
    }

    /**
     * Build 5 reels x 5 rows: [hiddenUpper, top, middle, bottom, hiddenLower].
     */
    private static buildRandomReels(): number[][] {
        return Array.from({ length: REELS }, () =>
            Array.from({ length: TOTAL_ROWS }, () => this.randIcon())
        );
    }

    /**
     * Evaluate left-to-right paylines
     */
    private static evaluateWins(reels: number[][]): WinLine[] {
        const results: WinLine[] = [];

        for (const line of PAYLINES) {
            const symbols: number[] = [];
            const indexes: number[] = [];

            // Collect symbols for this line. line.rows are payline-space (0..2);
            // physical reel rows are offset by VISIBLE_ROW_OFFSET to skip the hidden upper row.
            for (let reel = 0; reel < REELS; reel++) {
                const paylineRow = line.rows[reel];
                const physicalRow = paylineRow + VISIBLE_ROW_OFFSET;

                symbols.push(reels[reel][physicalRow]);
                indexes.push(this.toIndex(reel, paylineRow));
            }

            const evaluation = this.evaluateLine(symbols);

            if (!evaluation) {
                continue;
            }

            const { symbolId, count } = evaluation;

            const payout = PAYTABLE[symbolId]?.[count];

            if (!payout) {
                continue;
            }

            results.push({
                lineNumber: line.lineNumber,
                winAmount: payout,
                winIndexes: indexes.slice(0, count),
            });
        }

        return results;
    }

    /**
     * Left-to-right evaluation with wild substitution
     */
    private static evaluateLine(
        symbols: number[]
    ): { symbolId: number; count: number } | null {
        let baseSymbol: number | null = null;
        let count = 0;

        for (let i = 0; i < symbols.length; i++) {
            const current = symbols[i];

            // Wild
            if (current === WILD_SYMBOL) {
                count++;
                continue;
            }

            // First non-wild becomes target
            if (baseSymbol === null) {
                baseSymbol = current;
                count++;
                continue;
            }

            // Matching symbol
            if (current === baseSymbol) {
                count++;
                continue;
            }

            // Chain broken
            break;
        }

        // All wilds case
        if (baseSymbol === null) {
            baseSymbol = WILD_SYMBOL;
        }

        if (count < 3) {
            return null;
        }

        return {
            symbolId: baseSymbol,
            count,
        };
    }

    /**
     * Convert reel + payline-space row (0..2) to a flat index for WinEffectController.
     * Payline coordinates stay 3-row even though the reel data is 5-row.
     */
    private static toIndex(reel: number, paylineRow: number): number {
        return reel * VISIBLE_ROWS + paylineRow;
    }
}