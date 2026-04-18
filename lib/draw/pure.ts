export function matchUserScores(userScores: number[], drawnNumbers: number[]) {
    let matchCount = 0;
    const drawnSet = new Set(drawnNumbers);
    for (const s of userScores) {
        if (drawnSet.has(s)) matchCount++;
    }
    
    let matchType: '5_match' | '4_match' | '3_match' | null = null;
    if (matchCount === 5) matchType = '5_match';
    else if (matchCount === 4) matchType = '4_match';
    else if (matchCount === 3) matchType = '3_match';
    
    return { matchCount, matchType };
}

export function calculatePrizePool(netPool: number, previousRollover: number) {
    return {
        total: netPool + previousRollover,
        jackpot40: (netPool * 0.40) + previousRollover,
        tier4_35: netPool * 0.35,
        tier3_25: netPool * 0.25
    };
}

export function splitPrizeAmongWinners(tierTotal: number, winnerCount: number): number {
    if (winnerCount <= 0 || tierTotal <= 0) return 0;
    return Math.floor((tierTotal / winnerCount) * 100) / 100;
}

export function applyJackpotRollover(jackpotTotal: number, winnerCount: number): number {
    if (winnerCount === 0) {
        return jackpotTotal;
    }
    return 0; // The jackpot was claimed
}
