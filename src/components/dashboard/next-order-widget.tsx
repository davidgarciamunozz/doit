"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, ArrowRight, ChefHat } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format, isToday, isTomorrow, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/lib/types/orders";

interface NextOrderWidgetProps {
  nextOrder: Order | null;
}

export function NextOrderWidget({ nextOrder }: NextOrderWidgetProps) {
  if (!nextOrder) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />
            Next Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            No upcoming orders scheduled.
          </p>
          <Button variant="default" asChild className="w-full">
            <Link href="/dashboard/orders">
              Schedule an Order <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Parse date string (YYYY-MM-DD) without timezone issues
  // Split the date string and create a date in local timezone
  const [year, month, day] = nextOrder.delivery_date.split("-").map(Number);
  const orderDate = new Date(year, month - 1, day);

  console.log(
    "[NextOrderWidget] delivery_date string:",
    nextOrder.delivery_date,
  );
  console.log("[NextOrderWidget] parsed date:", orderDate);
  console.log(
    "[NextOrderWidget] formatted date:",
    format(orderDate, "EEEE, MMMM d"),
  );

  let dateDisplay = format(orderDate, "EEEE, MMMM d");
  if (isToday(orderDate)) dateDisplay = "Today";
  else if (isTomorrow(orderDate)) dateDisplay = "Tomorrow";

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />
            Next Order
          </CardTitle>
          <Badge
            variant="default"
            className="bg-primary text-primary-foreground border-primary/30 text-sm px-3 py-1"
          >
            {dateDisplay}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-foreground">
              {nextOrder.items?.length || 0}{" "}
              {(nextOrder.items?.length || 0) === 1 ? "Recipe" : "Recipes"}
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              {formatDistanceToNow(orderDate, { addSuffix: true })}
            </div>
          </div>

          <div className="space-y-2 bg-background/50 rounded-lg p-3">
            {nextOrder.items?.slice(0, 2).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <ChefHat className="h-4 w-4 text-primary" />
                <span className="truncate font-medium">
                  {item.recipe?.title || "Unknown"}
                </span>
                <span className="text-muted-foreground text-xs ml-auto">
                  x{item.quantity}
                </span>
              </div>
            ))}
            {(nextOrder.items?.length || 0) > 2 && (
              <div className="text-xs text-muted-foreground pl-6 font-medium">
                + {(nextOrder.items?.length || 0) - 2} more...
              </div>
            )}
          </div>

          <Button className="w-full" size="lg" asChild>
            <Link href="/dashboard/orders">
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
