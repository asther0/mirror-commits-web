'use client';

import { useMemo } from 'react';

/**
 * Generates a grid of contribution levels for the GitHub-style graph mockup.
 * Each cell is a value 0-4 representing contribution intensity.
 */
function generateGrid(fillPercentage) {
  const weeks = 20;
  const days = 7;
  const grid = [];

  for (let week = 0; week < weeks; week++) {
    const weekData = [];
    for (let day = 0; day < days; day++) {
      if (Math.random() < fillPercentage) {
        // Weighted towards lower levels for realism
        const randomLevel = Math.random();
        if (randomLevel < 0.4) weekData.push(1);
        else if (randomLevel < 0.7) weekData.push(2);
        else if (randomLevel < 0.9) weekData.push(3);
        else weekData.push(4);
      } else {
        weekData.push(0);
      }
    }
    grid.push(weekData);
  }
  return grid;
}

const LEVEL_COLORS = {
  before: [
    'bg-slate-100',
    'bg-green-200',
    'bg-green-300',
    'bg-green-400',
    'bg-green-500',
  ],
  after: [
    'bg-slate-100',
    'bg-green-300',
    'bg-green-400',
    'bg-green-500',
    'bg-green-600',
  ],
};

function GraphGrid({ grid, variant = 'before' }) {
  const colors = LEVEL_COLORS[variant];

  return (
    <div className="flex gap-[3px]">
      {grid.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-[3px]">
          {week.map((level, dayIndex) => (
            <div
              key={dayIndex}
              className={`w-[10px] h-[10px] rounded-[2px] ${colors[level]}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ContributionGraph() {
  const beforeGrid = useMemo(() => generateGrid(0.08), []);
  const afterGrid = useMemo(() => generateGrid(0.65), []);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Before */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
        <p className="text-sm font-semibold text-slate-500 mb-4">
          Tu GitHub ahora
        </p>
        <div className="flex justify-center overflow-hidden">
          <GraphGrid grid={beforeGrid} variant="before" />
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Casi vacio... pero si trabajaste todo el anio
        </p>
      </div>

      {/* After */}
      <div className="bg-white border border-accent/30 rounded-xl p-6 text-center shadow-sm shadow-accent/10">
        <p className="text-sm font-semibold text-accent-dark mb-4">
          Tu GitHub despues
        </p>
        <div className="flex justify-center overflow-hidden">
          <GraphGrid grid={afterGrid} variant="after" />
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Ahora si refleja tu esfuerzo real
        </p>
      </div>
    </div>
  );
}
