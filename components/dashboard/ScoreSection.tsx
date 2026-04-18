"use client"
import { useEffect, useState } from 'react';
import ScoreEntry from './ScoreEntry';
import ScoreList from './ScoreList';

export default function ScoreSection() {
    const [scores, setScores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const loadScores = async () => {
        try {
            const res = await fetch('/api/scores');
            const data = await res.json();
            if (data.scores) setScores(data.scores);
        } catch (err) {
            console.error("Failed to load scores");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadScores();
    }, []);

    if (loading) return <div className="py-12 text-center text-gray-500 font-medium animate-pulse">Loading scores...</div>;

    const existingDates = scores.map(s => s.score_date);

    return (
        <div className="mt-8">
            <ScoreEntry 
              scoresCount={scores.length} 
              existingDates={existingDates} 
              onScoreAdded={loadScores} 
            />
            
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-primary">Score History</h3>
               <span className="text-sm font-medium text-gray-500">{scores.length} recorded</span>
            </div>

            <ScoreList scores={scores} onScoreUpdated={loadScores} />
        </div>
    )
}
