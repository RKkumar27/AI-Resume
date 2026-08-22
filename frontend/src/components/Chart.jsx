import React from 'react';

export const Chart = ({
  title,
  data = [], // [{ label: "Mon", value: 40 }, { label: "Tue", value: 85 }]
  height = 180,
  barColor = "var(--color-primary)"
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 100);

  return (
    <div style={{ width: '100%' }}>
      {title && <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>{title}</h4>}
      <div className="flex items-end gap-sm" style={{ height: `${height}px`, width: '100%', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
        {data.map((item, idx) => {
          const heightPercent = (item.value / maxValue) * 100;
          return (
            <div key={idx} className="flex flex-col items-center gap-xs" style={{ flex: 1, height: '100%', justifyContent: 'flex-end' }}>
              <div 
                style={{
                  width: '80%',
                  maxWidth: '32px',
                  height: `${heightPercent}%`,
                  backgroundColor: barColor,
                  borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                  transition: 'height 0.5s ease-out'
                }}
                title={`${item.label}: ${item.value}`}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)', position: 'absolute', bottom: '-1.2rem' }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chart;
