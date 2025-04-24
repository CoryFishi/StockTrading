import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config.js";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_SCHEDULE = {
  openTime: "09:30",
  closeTime: "16:00",
  openWeekdays: [1, 2, 3, 4, 5],
};
const MARKET_TZ = "America/New_York";

const toZonedDate = (d = new Date(), tz = MARKET_TZ) => {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(d).map(({ type, value }) => [type, value])
  );
  return new Date(
    `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`
  );
};

export const isMarketOpen = (schedule, when = new Date()) => {
  const dz = toZonedDate(when);
  const isoDate = dz.toISOString().slice(0, 10);
  const weekday = dz.getUTCDay() || 7;
  const minutes = dz.getHours() * 60 + dz.getMinutes();
  const openMin =
    +schedule.openTime.slice(0, 2) * 60 + +schedule.openTime.slice(3);
  const closeMin =
    +schedule.closeTime.slice(0, 2) * 60 + +schedule.closeTime.slice(3);

  const weekend = !schedule.openWeekdays.includes(weekday);
  const holiday = schedule.holidays.includes(isoDate);

  return !weekend && !holiday && minutes >= openMin && minutes <= closeMin;
};

const MarketScheduleModal = ({ isOpen, onClose }) => {
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/market-schedule`);
        const data = res.ok ? await res.json() : DEFAULT_SCHEDULE;
        setSchedule({ ...DEFAULT_SCHEDULE, ...data });
      } catch {}
      setLoading(false);
    })();
  }, [isOpen]);

  const toggleWeekday = (d) =>
    setSchedule((s) =>
      s.openWeekdays.includes(d)
        ? { ...s, openWeekdays: s.openWeekdays.filter((x) => x !== d) }
        : { ...s, openWeekdays: [...s.openWeekdays, d].sort() }
    );

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/market-schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schedule),
      });
    } catch {}
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">
          Market Schedule
        </h2>

        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Loading…
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              {["openTime", "closeTime"].map((key) => (
                <div key={key} className="flex flex-col cursor-pointer">
                  <label className="mb-1 text-sm font-medium text-black dark:text-gray-200">
                    {key === "openTime" ? "Open Time" : "Close Time"}
                  </label>
                  <input
                    type="time"
                    value={schedule[key]}
                    onChange={(e) =>
                      setSchedule({ ...schedule, [key]: e.target.value })
                    }
                    className="p-2 border rounded dark:bg-zinc-700 dark:text-white cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-black dark:text-gray-200">
                Trading Days
              </p>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((lbl, i) => {
                  const d = i + 1;
                  const active = schedule.openWeekdays.includes(d);
                  return (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => toggleWeekday(d)}
                      className={`px-3 py-1 rounded border ${
                        active
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-transparent text-black dark:text-gray-300 border-gray-400"
                      }`}
                    >
                      {lbl}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                className="w-full bg-zinc-500 text-white py-2 rounded hover:bg-zinc-600"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="button"
                disabled={saving}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MarketScheduleModal;
