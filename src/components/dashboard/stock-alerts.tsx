"use client";

import { StockAlert } from "@/app/actions/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StockAlertsProps {
  alerts: StockAlert[];
}

export function StockAlerts({ alerts }: StockAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/40 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            Stock Alerts
          </CardTitle>
          <Button
            variant="link"
            asChild
            className="h-auto p-0 text-destructive hover:text-destructive/80 font-medium"
          >
            <Link href="/dashboard/inventory/ingredients">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 hover:bg-destructive/15 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <span className="font-semibold text-base">{item.name}</span>
                </div>
                <span className="font-bold text-lg text-destructive">
                  {item.stock_quantity} {item.stock_unit}
                </span>
              </div>

              <div className="flex items-center justify-between pl-7">
                <span className="text-sm text-muted-foreground">
                  Min: {item.stock_low} {item.stock_unit}
                </span>
                {item.missing_for_orders && (
                  <Badge
                    variant="destructive"
                    className="h-6 px-2 text-xs font-semibold flex gap-1.5 items-center"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Missing {item.missing_for_orders} {item.stock_unit}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
