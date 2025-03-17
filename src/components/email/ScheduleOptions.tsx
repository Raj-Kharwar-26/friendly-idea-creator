
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, setHours, setMinutes } from "date-fns";
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    scheduledTime ? scheduledTime : undefined
  );
  const [selectedHour, setSelectedHour] = useState<string>("12");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("PM");

  // Generate hours options (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1;
    return hour.toString().padStart(2, '0');
  });

  // Generate minutes options (00, 15, 30, 45)
  const minutes = ["00", "15", "30", "45"];

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    updateScheduledTime(date);
  };

  const updateScheduledTime = (date?: Date) => {
    if (!date) return;
    
    const newDate = new Date(date);
    let hour = parseInt(selectedHour);
    
    // Convert to 24-hour format
    if (selectedPeriod === "PM" && hour < 12) {
      hour += 12;
    } else if (selectedPeriod === "AM" && hour === 12) {
      hour = 0;
    }
    
    const minute = parseInt(selectedMinute);
    
    newDate.setHours(hour, minute, 0, 0);
    setScheduledTime(newDate);
  };

  const handleHourChange = (value: string) => {
    setSelectedHour(value);
    updateScheduledTime(selectedDate);
  };

  const handleMinuteChange = (value: string) => {
    setSelectedMinute(value);
    updateScheduledTime(selectedDate);
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    updateScheduledTime(selectedDate);
  };

  const handleSaveSchedule = () => {
    if (selectedDate) {
      updateScheduledTime(selectedDate);
      setShowSchedule(false);
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
          <p className="text-sm text-muted-foreground mb-4">Select a date and time to schedule your email:</p>
          
          <div className="flex flex-col space-y-4">
            {/* Date Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                initialFocus
                disabled={(date) => date < new Date()}
                className="pointer-events-auto"
              />
            </div>
            
            {/* Time Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Time</label>
              <div className="flex space-x-2">
                {/* Hour */}
                <Select value={selectedHour} onValueChange={handleHourChange}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Minute */}
                <Select value={selectedMinute} onValueChange={handleMinuteChange}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* AM/PM */}
                <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSchedule(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveSchedule}
              disabled={!selectedDate}
            >
              Save Schedule
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleOptions;
