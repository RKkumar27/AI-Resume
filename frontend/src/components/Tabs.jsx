import React, { useState } from 'react';

export const Tabs = ({ tabs = [], defaultActiveIndex = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultActiveIndex);

  if (!tabs.length) return null;

  return (
    <div style={{ width: '100%' }}>
      <div className="tabs-header" role="tablist">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={activeTab === idx}
            className={`tab-btn ${activeTab === idx ? 'active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.icon && <span style={{ marginRight: '0.4rem' }}>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" style={{ paddingTop: 'var(--space-md)' }}>
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;
