"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useStoresReady } from "@/hooks/useStoresReady";
import { useWeightStore } from "@/store/useWeightStore";
import { addDays, formatShortDate, toDateKey } from "@/lib/date";

export default function WeightPage() {
  const ready = useStoresReady();
  const entries = useWeightStore((s) => s.entries);
  const logWeight = useWeightStore((s) => s.logWeight);
  const rollingAverage = useWeightStore((s) => s.rollingAverage);
  const trend = useWeightStore((s) => s.trend);
  const sortedEntries = useWeightStore((s) => s.sortedEntries);

  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(today);
  const todaysEntry = entries.find((e) => e.date === todayKey);
  const [input, setInput] = useState(todaysEntry ? String(todaysEntry.weight) : "");

  const avg7 = rollingAverage(todayKey, 7);
  const weekTrend = trend(7);
  const monthTrend = trend(30);

  const chartData = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => addDays(today, -(29 - i)));
    return days.map((d) => {
      const key = toDateKey(d);
      const entry = entries.find((e) => e.date === key);
      return {
        label: formatShortDate(d),
        weight: entry?.weight ?? null,
        average: rollingAverage(key, 7),
      };
    });
  }, [entries, today, rollingAverage]);

  function handleSave() {
    const value = Number(input);
    if (!value || value <= 0) return;
    logWeight(value, today);
  }

  if (!ready) {
    return <div className="animate-pulse text-muted">Loading…</div>;
  }

  return (
    <div className="flex flex-col gap-5 pb-4">
      <h1 className="text-2xl font-bold">Weight</h1>

      <Card className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Today&apos;s Weight</p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            inputMode="decimal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="0.0"
            className="w-32 rounded-xl bg-surface-raised border border-border px-3 py-2.5 text-3xl font-bold text-center focus:outline-none focus:border-accent-strong"
          />
          <span className="text-lg text-muted">lbs</span>
          <Button onClick={handleSave} className="ml-auto">
            Save
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">7-Day Average</p>
          <p className="text-xl font-bold">{avg7 ?? "—"}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">7-Day Trend</p>
          <p className="text-xl font-bold">
            {weekTrend ? `${weekTrend.change > 0 ? "+" : ""}${weekTrend.change}` : "—"}
          </p>
        </Card>
      </div>

      {monthTrend && (
        <Card className="flex items-center justify-between">
          <p className="text-sm text-muted">Last 30 days</p>
          <p className="text-lg font-semibold">
            {monthTrend.change <= 0 ? "▼" : "▲"} {Math.abs(monthTrend.change)} lbs
          </p>
        </Card>
      )}

      <Card>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">30-Day Trend</p>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#262b3a" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#8b90a0", fontSize: 10 }}
                interval={6}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["dataMin - 3", "dataMax + 3"]}
                tick={{ fill: "#8b90a0", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={44}
                tickFormatter={(v: number) => v.toFixed(0)}
              />
              <Tooltip
                contentStyle={{ background: "#171b27", border: "1px solid #262b3a", borderRadius: 12 }}
                labelStyle={{ color: "#8b90a0" }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#8b90a0"
                strokeWidth={1.5}
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#34d399"
                strokeWidth={2.5}
                dot={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">History</p>
        <div className="flex flex-col divide-y divide-border">
          {sortedEntries()
            .slice(-14)
            .reverse()
            .map((e) => (
              <div key={e.date} className="flex items-center justify-between py-2">
                <span className="text-sm text-muted">{formatShortDate(new Date(e.date + "T00:00:00"))}</span>
                <span className="font-semibold">{e.weight} lbs</span>
              </div>
            ))}
          {entries.length === 0 && <p className="py-2 text-sm text-muted">No entries yet.</p>}
        </div>
      </Card>
    </div>
  );
}
