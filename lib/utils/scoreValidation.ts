export function validateScore(value: number): { valid: boolean; error?: string } {
    if (!Number.isInteger(value)) return { valid: false, error: 'Score must be a whole number.' };
    if (value < 1 || value > 45) return { valid: false, error: 'Score must be between 1 and 45.' };
    return { valid: true };
}

export function validateScoreDate(date: string, existingDates: string[]): { valid: boolean; error?: string } {
    if (!date) return { valid: false, error: 'Date is required.' };
    if (existingDates.includes(date)) return { valid: false, error: 'A score already exists for this date.' };
    return { valid: true };
}

export function formatScoreDate(date: string) {
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
