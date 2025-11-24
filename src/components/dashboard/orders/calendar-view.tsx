"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { Order } from "@/lib/types/orders";
import { Recipe } from "@/lib/types/recipe";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddOrderDialog } from "./add-order-dialog";
import { OrderRequirementsDialog } from "./order-requirements-dialog";

interface CalendarViewProps {
  initialOrders: Order[];
  recipes: Recipe[];
  currentMonth: Date;
}

export function CalendarView({
  initialOrders,
  recipes,
  currentMonth,
}: CalendarViewProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(false);

  const orders = initialOrders;

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { locale: enUS });
    const calendarEnd = endOfWeek(monthEnd, { locale: enUS });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const navigateMonth = (date: Date) => {
    const newMonthStr = format(date, "yyyy-MM-dd");
    router.push(`/dashboard/orders?month=${newMonthStr}`);
  };

  const nextMonth = () => navigateMonth(addMonths(currentMonth, 1));
  const prevMonth = () => navigateMonth(subMonths(currentMonth, 1));

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsRequirementsOpen(true);
  };

  const handleAddOrder = (e: React.MouseEvent, date: Date) => {
    e.stopPropagation();
    setSelectedDate(date);
    setIsAddOrderOpen(true);
  };

  const getOrdersForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return orders.filter((order) => order.delivery_date === dateStr);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <h2 className="text-xl sm:text-2xl font-bold capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: enUS })}
          </h2>
          <div className="flex items-center rounded-md border bg-background shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMonth}
              className="h-7 w-7 sm:h-8 sm:w-8"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              className="h-7 w-7 sm:h-8 sm:w-8"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
        <Button
          onClick={() => {
            setSelectedDate(new Date());
            setIsAddOrderOpen(true);
          }}
          size="sm"
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      {/* Calendar */}
      <div className="border rounded-lg shadow-sm overflow-hidden bg-background">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b bg-muted/40">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-1.5 sm:p-2 md:p-3 text-center text-xs sm:text-sm font-semibold text-muted-foreground"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 1)}</span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y">
          {days.map((day) => {
            const dayOrders = getOrdersForDay(day);
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

            return (
              <div
                key={day.toString()}
                className={cn(
                  "relative group p-1 sm:p-1.5 md:p-2 transition-all hover:bg-accent/50 cursor-pointer flex flex-col min-h-[60px] sm:min-h-[80px] md:min-h-[100px]",
                  !isCurrentMonth && "bg-muted/20 text-muted-foreground",
                )}
                onClick={() => handleDayClick(day)}
              >
                <div className="flex justify-between items-start mb-0.5 sm:mb-1">
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-medium h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 flex items-center justify-center rounded-full transition-colors",
                      isToday(day)
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground/70",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 sm:h-6 sm:w-6 opacity-0 group-hover:opacity-100 transition-opacity -mr-0.5 -mt-0.5 sm:-mr-1 sm:-mt-1"
                    onClick={(e) => handleAddOrder(e, day)}
                  >
                    <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-0.5 sm:space-y-1">
                  {dayOrders.slice(0, 2).map((order) => (
                    <div
                      key={order.id}
                      className="text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 sm:py-1 rounded bg-primary/10 text-primary border border-primary/20 truncate font-medium"
                    >
                      {order.items?.length}{" "}
                      {order.items?.length === 1 ? "item" : "items"}
                    </div>
                  ))}
                  {dayOrders.length > 2 && (
                    <div className="text-[10px] sm:text-xs text-muted-foreground px-1">
                      +{dayOrders.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <>
          <AddOrderDialog
            open={isAddOrderOpen}
            onOpenChange={setIsAddOrderOpen}
            selectedDate={selectedDate}
            recipes={recipes}
          />

          <OrderRequirementsDialog
            open={isRequirementsOpen}
            onOpenChange={setIsRequirementsOpen}
            date={selectedDate}
            orders={getOrdersForDay(selectedDate)}
          />
        </>
      )}
    </div>
  );
}
