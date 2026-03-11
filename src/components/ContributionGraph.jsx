'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';

function seededRandom(seed) {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DAYS_ES = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

function generateGrid(fillPercentage, baseSeed) {
  const weeks = 20;
  const days = 7;
  const grid = [];
  let seed = baseSeed;

  const today = new Date(2026, 2, 10);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (weeks * 7));

  for (let week = 0; week < weeks; week++) {
    const weekData = [];
    for (let day = 0; day < days; day++) {
      seed++;
      const cellDate = new Date(startDate);
      cellDate.setDate(cellDate.getDate() + week * 7 + day);

      const rand = seededRandom(seed);
      let level = 0;
      let commits = 0;

      if (rand < fillPercentage) {
        seed++;
        const levelRand = seededRandom(seed);
        if (levelRand < 0.4) { level = 1; commits = Math.floor(seededRandom(++seed) * 3) + 1; }
        else if (levelRand < 0.7) { level = 2; commits = Math.floor(seededRandom(++seed) * 4) + 3; }
        else if (levelRand < 0.9) { level = 3; commits = Math.floor(seededRandom(++seed) * 5) + 6; }
        else { level = 4; commits = Math.floor(seededRandom(++seed) * 6) + 10; }
      }

      weekData.push({
        level,
        commits,
        date: `${DAYS_ES[cellDate.getDay()]} ${cellDate.getDate()} ${MONTHS_ES[cellDate.getMonth()]}`,
      });
    }
    grid.push(weekData);
  }
  return grid;
}

const BEFORE_GRID = generateGrid(0.08, 12345);
const AFTER_GRID = generateGrid(0.65, 67890);

const LEVEL_COLORS = {
  before: ['bg-slate-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500'],
  after: ['bg-slate-100', 'bg-green-300', 'bg-green-400', 'bg-green-500', 'bg-green-600'],
};

function GraphGrid({ grid, variant = 'before' }) {
  const [tooltip, setTooltip] = useState(null);
  const colors = LEVEL_COLORS[variant];

  return (
    <div className="relative">
      <div className="flex gap-[3px] sm:gap-[4px]">
        {grid.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[3px] sm:gap-[4px]">
            {week.map((cell, dayIndex) => (
              <div
                key={dayIndex}
                className={`w-[10px] h-[10px] sm:w-[13px] sm:h-[13px] rounded-[2px] cursor-pointer transition-all hover:ring-1 hover:ring-slate-400 hover:ring-offset-1 ${colors[cell.level]}`}
                onMouseEnter={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  setTooltip({
                    text: cell.commits > 0
                      ? `${cell.commits} commit${cell.commits !== 1 ? 's' : ''} el ${cell.date}`
                      : `Sin commits el ${cell.date}`,
                    x: rect.left + rect.width / 2,
                    y: rect.top - 4,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
        ))}
      </div>

      {tooltip && createPortal(
        <div
          className="fixed z-50 px-3 py-2 bg-slate-800 text-white text-xs rounded-md whitespace-nowrap pointer-events-none shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {tooltip.text}
        </div>,
        document.body
      )}
    </div>
  );
}

export default function ContributionGraph() {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <p className="text-sm font-medium text-slate-400 mb-4">Tu GitHub ahora</p>
        <div className="flex justify-center overflow-x-auto pb-1">
          <GraphGrid grid={BEFORE_GRID} variant="before" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <p className="text-sm font-medium text-slate-900 mb-4">Tu GitHub después</p>
        <div className="flex justify-center overflow-x-auto pb-1">
          <GraphGrid grid={AFTER_GRID} variant="after" />
        </div>
      </div>
    </div>
  );
}
