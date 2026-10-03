"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Clock2Icon } from "lucide-react";
import type { DateRange } from "react-day-picker";

interface CalendarWithTimeProps {
  dateRange?: DateRange;
  onDateRangeChange: (dateRange?: DateRange) => void;
  timeFrom: string;
  onTimeFromChange: (time: string) => void;
  timeTo: string;
  onTimeToChange: (time: string) => void;
}

const CalendarWithTime = ({
  dateRange,
  onDateRangeChange,
  timeFrom,
  onTimeFromChange,
  timeTo,
  onTimeToChange,
}: CalendarWithTimeProps) => (
  <Card className="w-full gap-0 rounded-none border-0 py-0 shadow-none">
    <CardContent className="px-0">
      <Calendar
        mode="range"
        min={1}
        selected={dateRange}
        onSelect={onDateRangeChange}
        disabled={{ before: new Date() }}
        className="mx-auto p-0"
      />
    </CardContent>
    <CardFooter className="grid grid-cols-2 gap-3 border-t bg-card px-4 py-3">
      <label className="min-w-0 text-xs font-medium text-foreground">
        Bắt đầu
        <InputGroup className="mt-1.5">
          <InputGroupInput
            type="time"
            step="60"
            value={timeFrom}
            onChange={(event) => onTimeFromChange(event.target.value)}
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
          <InputGroupAddon align="inline-end">
            <Clock2Icon className="size-4 text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </label>
      <label className="min-w-0 text-xs font-medium text-foreground">
        Kết thúc
        <InputGroup className="mt-1.5">
          <InputGroupInput
            type="time"
            step="60"
            value={timeTo}
            onChange={(event) => onTimeToChange(event.target.value)}
            className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
          <InputGroupAddon align="inline-end">
            <Clock2Icon className="size-4 text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </label>
    </CardFooter>
  </Card>
);

export default CalendarWithTime;
