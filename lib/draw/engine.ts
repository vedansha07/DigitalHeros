import { SupabaseClient } from '@supabase/supabase-js';
import { matchUserScores, calculatePrizePool, splitPrizeAmongWinners, applyJackpotRollover } from './pure';

export function generateRandomDraw(): number[] {
    const selected: Set<number> = new Set();
    while (selected.size < 5) {
        const randomNum = Math.floor(Math.random() * 45) + 1;
        selected.add(randomNum);
    }
    return Array.from(selected);
}

export function generateAlgorithmicDraw(frequencies: Record<number, number>, mode: 'most_frequent' | 'least_frequent'): number[] {
    let pool: { num: number, weight: number }[] = [];
    
    let maxFreq = 0;
    for (let i = 1; i <= 45; i++) {
        const f = frequencies[i] || 0;
        if (f > maxFreq) maxFreq = f;
    }

    for (let i = 1; i <= 45; i++) {
        const freq = frequencies[i] || 0;
        let weight = 0;
        if (mode === 'most_frequent') {
            weight = freq + 1;
        } else {
            weight = (maxFreq - freq) + 1;
        }
        pool.push({ num: i, weight });
    }

    const selected: Set<number> = new Set();
    while (selected.size < 5) {
        const currentPool = pool.filter(p => !selected.has(p.num));
        const totalWeight = currentPool.reduce((sum, p) => sum + p.weight, 0);
        let randomVal = Math.random() * totalWeight;
        
        for (const item of currentPool) {
            randomVal -= item.weight;
            if (randomVal <= 0) {
                selected.add(item.num);
                break;
            }
        }
    }
    
    return Array.from(selected);
}

export async function processDrawResults(drawId: string, supabase: SupabaseClient, save: boolean = false) {
    const { data: draw } = await supabase.from('draws').select('*').eq('id', drawId).single();
    if (!draw) throw new Error("Draw not found");

    const { data: entries } = await supabase.from('draw_entries').select('*').eq('draw_id', drawId);
    
    const drawnNumbers = draw.drawn_numbers;
    const results = [];
    
    let winners5 = 0;
    let winners4 = 0;
    let winners3 = 0;
    
    for (const entry of entries || []) {
        const { matchType } = matchUserScores(entry.score_snapshot, drawnNumbers);
        if (matchType) {
            if (matchType === '5_match') winners5++;
            if (matchType === '4_match') winners4++;
            if (matchType === '3_match') winners3++;
            
            results.push({
                user_id: entry.user_id,
                draw_id: drawId,
                match_type: matchType
            });
        }
    }
    
    const breakdown = calculatePrizePool(draw.total_prize_pool, draw.jackpot_rollover_amount);
    
    const prize5 = splitPrizeAmongWinners(breakdown.jackpot40, winners5);
    const prize4 = splitPrizeAmongWinners(breakdown.tier4_35, winners4);
    const prize3 = splitPrizeAmongWinners(breakdown.tier3_25, winners3);
    
    const nextRollover = applyJackpotRollover(breakdown.jackpot40, winners5);
    
    const finalResults = results.map(r => {
        let prize_amount = 0;
        if (r.match_type === '5_match') prize_amount = prize5;
        if (r.match_type === '4_match') prize_amount = prize4;
        if (r.match_type === '3_match') prize_amount = prize3;
        return { ...r, prize_amount, payment_status: 'pending' };
    });
    
    if (save) {
        if (finalResults.length > 0) {
            await supabase.from('draw_results').insert(finalResults);
        }
        await supabase.from('draws').update({
            status: 'published'
        }).eq('id', drawId);
    }
    
    return {
        winners5,
        winners4,
        winners3,
        details: { prize5, prize4, prize3 },
        jackpotRolled: nextRollover,
        results: finalResults,
        entriesCount: entries?.length || 0,
    }
}
