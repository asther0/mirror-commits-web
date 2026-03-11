'use client';

function seededRandom(seed) {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function generateGrid(fillPercentage, baseSeed) {
  const weeks = 20;
  const days = 7;
  const grid = [];
  let seed = baseSeed;

  for (let week = 0; week < weeks; week++) {
    const weekData = [];
    for (let day = 0; day < days; day++) {
      seed++;
      const rand = seededRandom(seed);
      if (rand < fillPercentage) {
        seed++;
        const levelRand = seededRandom(seed);
        if (levelRand < 0.4) weekData.push(1);
        else if (levelRand < 0.7) weekData.push(2);
        else if (levelRand < 0.9) weekData.push(3);
        else weekData.push(4);
      } else {
        weekData.push(0);
      }
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
  const colors = LEVEL_COLORS[variant];

  return (
    <div className="flex gap-[2px] sm:gap-[3px]">
      {grid.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-[2px] sm:gap-[3px]">
          {week.map((level, dayIndex) => (
            <div
              key={dayIndex}
              className={`w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[2px] ${colors[level]}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ContributionGraph() {
  return (
    <div className="space-y-4">
      {/* Before */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
        <p className="text-xs font-medium text-slate-400 mb-3">Tu GitHub ahora</p>
        <div className="flex justify-center overflow-x-auto pb-1">
          <GraphGrid grid={BEFORE_GRID} variant="before" />
        </div>
        <p className="text-xs text-slate-400 mt-2">Casi vacío... pero trabajaste todo el año</p>
      </div>

      {/* After */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
        <p className="text-xs font-medium text-slate-900 mb-3">Tu GitHub después</p>
        <div className="flex justify-center overflow-x-auto pb-1">
          <GraphGrid grid={AFTER_GRID} variant="after" />
        </div>
        <p className="text-xs text-slate-400 mt-2">Ahora sí se ve tu actividad</p>
      </div>
    </div>
  );
}
