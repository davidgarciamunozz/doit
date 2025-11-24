"use client";

import { DashboardStats as DashboardStatsType } from "@/lib/types/dashboard-stats";
import {
  ChefHat,
  Package,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardStatsProps {
  stats: DashboardStatsType;
  children?: ReactNode;
}

export default function DashboardStats({
  stats,
  children,
}: DashboardStatsProps) {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your bakery business
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Recipes */}
        <StatCard
          title="Total Recipes"
          value={stats.totalRecipes}
          icon={<ChefHat className="h-6 w-6 text-blue-600" />}
          bgColor="bg-blue-50"
          link="/dashboard/recipes"
        />

        {/* Total Ingredients */}
        <StatCard
          title="Total Ingredients"
          value={stats.totalIngredients}
          icon={<Package className="h-6 w-6 text-green-600" />}
          bgColor="bg-green-50"
          link="/dashboard/inventory/ingredients"
        />

        {/* Low Stock Alerts */}
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockIngredients}
          icon={<AlertTriangle className="h-6 w-6 text-orange-600" />}
          bgColor="bg-orange-50"
          alert={stats.lowStockIngredients > 0}
        />

        {/* Inventory Value */}
        <StatCard
          title="Inventory Value"
          value={formatCurrency(stats.totalInventoryValue)}
          icon={<DollarSign className="h-6 w-6 text-purple-600" />}
          bgColor="bg-purple-50"
        />
      </div>

      {/* Widgets Section - Inserted here */}
      {children && <div>{children}</div>}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Used Ingredients */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              Most Used Ingredients
            </h2>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>

          {stats.topUsedIngredients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No ingredient data yet</p>
              <p className="text-sm mt-2">
                Start adding ingredients to your recipes
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.topUsedIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-card-foreground">
                        {ingredient.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Used in {ingredient.count} recipe
                        {ingredient.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={ingredient.stock_status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Recipes */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-card-foreground">
              Recent Recipes
            </h2>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>

          {stats.recentRecipes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recipes yet</p>
              <p className="text-sm mt-2">
                <Link
                  href="/dashboard/recipes/new"
                  className="text-primary hover:underline"
                >
                  Create your first recipe
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium text-card-foreground">
                      {recipe.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {recipe.ingredient_count} ingredient
                      {recipe.ingredient_count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-card-foreground">
                      {formatCurrency(recipe.calculated_cost)}
                    </p>
                    <p className="text-xs text-muted-foreground">Cost</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stock Alerts */}
      {stats.stockAlerts.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-200 dark:border-orange-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-500" />
            <h2 className="text-lg font-semibold text-foreground">
              Stock Alerts
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.stockAlerts.map((alert, index) => (
              <div
                key={index}
                className="bg-card rounded-lg p-4 border border-orange-200 dark:border-orange-800"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">
                      {alert.ingredient_name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {alert.current_quantity > 0
                        ? `${alert.current_quantity} ${alert.unit} left`
                        : alert.current_quantity === 0
                          ? "Out of stock"
                          : `Missing ${Math.abs(alert.current_quantity)} ${alert.unit}`}
                    </p>
                  </div>
                  <StatusBadge status={alert.status} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/dashboard/inventory/ingredients"
              className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium hover:underline"
            >
              View all ingredients →
            </Link>
          </div>
        </div>
      )}

      {/* Empty State */}
      {stats.totalRecipes === 0 && stats.totalIngredients === 0 && (
        <div className="bg-card rounded-2xl shadow-sm border border-border p-12 text-center">
          <div className="max-w-md mx-auto">
            <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Welcome to your Dashboard!
            </h3>
            <p className="text-muted-foreground mb-6">
              Start by adding ingredients to your inventory and creating your
              first recipe.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard/inventory/ingredients"
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Add Ingredients
              </Link>
              <Link
                href="/dashboard/recipes/new"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Create Recipe
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
  link?: string;
  alert?: boolean;
}

function StatCard({ title, value, icon, bgColor, link, alert }: StatCardProps) {
  const content = (
    <div
      className={`${bgColor} dark:bg-card rounded-2xl p-6 border border-border ${link ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p
            className={`text-3xl font-bold ${alert ? "text-orange-600 dark:text-orange-500" : "text-foreground"}`}
          >
            {value}
          </p>
        </div>
        <div className="p-3 bg-background dark:bg-muted rounded-lg">{icon}</div>
      </div>
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    available:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    low: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    unavailable:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
    shortage: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  };

  const labels: Record<string, string> = {
    available: "Available",
    low: "Low",
    unavailable: "Out",
    shortage: "Shortage",
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status] || "bg-muted text-muted-foreground"}`}
    >
      {labels[status] || status}
    </span>
  );
}
