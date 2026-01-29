import React from 'react';
import { Trash2, Plus } from 'lucide-react';

const TimeRangePicker = ({ periods, onChange, disabled }) => {

    // safe guard if periods is undefined
    const safePeriods = Array.isArray(periods) ? periods : [];

    // Sort periods by start time for display
    // const sortedPeriods = [...safePeriods].sort((a, b) => a.start.localeCompare(b.start)); 
    // ^ Sorting on render might cause jumpiness while editing. Let's just render as is or sort on save/add.

    const addPeriod = () => {
        const newPeriod = { start: '13:00', end: '17:00' };

        // Simple logic to try and avoid overlap if there's already a morning slot
        if (safePeriods.length > 0) {
            // If last period ends at 12:00, default next to 13:00-17:00
            // But let's just default to a standard afternoon block
        }

        onChange([...safePeriods, newPeriod]);
    };

    const removePeriod = (index) => {
        const newPeriods = [...safePeriods];
        newPeriods.splice(index, 1);
        onChange(newPeriods);
    };

    const updatePeriod = (index, field, value) => {
        const newPeriods = [...safePeriods];
        newPeriods[index] = { ...newPeriods[index], [field]: value };
        onChange(newPeriods);
    };

    return (
        <div className="space-y-2">
            {safePeriods.map((period, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                        type="time"
                        value={period.start}
                        onChange={(e) => updatePeriod(index, 'start', e.target.value)}
                        disabled={disabled}
                        className="p-1 border border-gray-300 rounded text-sm focus:ring-cyan-500 focus:border-cyan-500"
                        style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #ccc' }}
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="time"
                        value={period.end}
                        onChange={(e) => updatePeriod(index, 'end', e.target.value)}
                        disabled={disabled}
                        className="p-1 border border-gray-300 rounded text-sm focus:ring-cyan-500 focus:border-cyan-500"
                        style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #ccc' }}
                    />

                    {!disabled && (
                        <button
                            onClick={() => removePeriod(index)}
                            className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 ml-2"
                            title="Zeitraum entfernen"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <Trash2 size={16} color="#ef4444" />
                        </button>
                    )}
                </div>
            ))}

            {!disabled && safePeriods.length < 5 && (
                <button
                    onClick={addPeriod}
                    className="text-xs flex items-center gap-1 text-cyan-600 hover:text-cyan-800 font-medium mt-1"
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px',
                        color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem'
                    }}
                >
                    <Plus size={14} /> Zeitraum hinzufügen
                </button>
            )}

            {safePeriods.length === 0 && <span className="text-xs text-gray-400 italic">Keine Zeiten (geschlossen)</span>}
        </div>
    );
};

export default TimeRangePicker;
