import React from 'react';

export const ScoreCircle = ({ score = 0, maxScore = 100, label = '' }) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const deg = (percentage / 100) * 360;

  return (
    <div className="flex flex-col items-center gap-xs">
      <div 
        className="score-circle" 
        style={{ '--score-deg': deg }}
      >
        <span className="score-value">{score}</span>
        <span className="score-max">/{maxScore}</span>
      </div>
      {label && <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>{label}</span>}
    </div>
  );
};

export default ScoreCircle;
