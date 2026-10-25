"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type DailyVisitorPoint = {
  date: string;
  views: number;
  visitors: number;
};

export function VisitorChart({ data }: { data: DailyVisitorPoint[] }) {
  const gradientId = useId().replace(/:/g, "");

  if (!data || data.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Visitor Activity</CardTitle>
          <CardDescription>Daily traffic over the past 14 days</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-sm text-muted-foreground">
          No traffic data recorded yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Daily Traffic & Visitors</CardTitle>
        <CardDescription>
          Page views and unique visitors over the last 14 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0969c3" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0969c3" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id={`${gradientId}-alt`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#b45309" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#b45309" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                tickFormatter={(value) => {
                  try {
                    const parts = value.split("-");
                    return `${parts[1]}/${parts[2]}`;
                  } catch {
                    return value;
                  }
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-border bg-popover p-3 shadow-md text-xs">
                        <p className="font-semibold text-foreground mb-1">
                          {label}
                        </p>
                        <p className="text-primary flex items-center gap-1.5 font-medium">
                          <span className="inline-block size-2 rounded-full bg-primary" />
                          Page Views: {payload[0]?.value ?? 0}
                        </p>
                        <p className="text-amber-700 flex items-center gap-1.5 font-medium mt-0.5">
                          <span className="inline-block size-2 rounded-full bg-amber-600" />
                          Unique Visitors: {payload[1]?.value ?? 0}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#0969c3"
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
                name="Page Views"
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#b45309"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill={`url(#${gradientId}-alt)`}
                name="Visitors"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
