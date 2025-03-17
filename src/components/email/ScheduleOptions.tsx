
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, X } from "lucide-react";

interface ScheduleOptionsProps {
  showSchedule: boolean;
  setShowSchedule: (show: boolean) => void;
  scheduledTime: Date | null;
  setScheduledTime: (date: Date | null) => void;
}

const ScheduleOptions: React.FC<ScheduleOptionsProps> = ({
  showSchedule,
  setShowSchedule,
  scheduledTime,
  setScheduledTime
}) => {
  const handleTimeChange = (date: Date | undefined) => {
    if (date) {
      // Set time to current time if only date is selected
      const now = new Date();
      date.setHours(now.getHours());
      date.setMinutes(now.getMinutes());
      setScheduledTime(date);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant={showSchedule ? "default" : "outline"}
          onClick={() => setShowSchedule(!showSchedule)}
        >
          <Clock className="mr-2 h-4 w-4" />
          Schedule for Later
        </Button>
        
        {scheduledTime && (
          <div className="flex items-center bg-muted text-muted-foreground px-3 py-1 rounded-md text-sm">
            Scheduled for: {format(scheduledTime, "PPP p")}
            <button
              type="button"
              className="ml-2 text-muted-foreground/70 hover:text-muted-foreground"
              onClick={() => {
                setScheduledTime(null);
                setShowSchedule(false);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      
      {showSchedule && !scheduledTime && (
        <div className="p-4 border rounded-md">
          <p className="text-sm text-muted-foreground mb-2">Select a date and time to schedule your email:</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Calendar
              mode="single"
              selected={scheduledTime || undefined}
              onSelect={handleTimeChange}
              initialFocus
            />
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSchedule(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleOptions;
