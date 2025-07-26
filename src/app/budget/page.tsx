import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBank } from "lucide-react";

export default function BudgetPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <PiggyBank className="w-10 h-10 text-primary" />
            <div>
              <CardTitle className="text-3xl">Budget Transparency</CardTitle>
              <CardDescription>Explore how city funds are allocated and spent on various projects and services.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page is under construction. Check back soon for detailed budget information and visualizations!</p>
        </CardContent>
      </Card>
    </div>
  );
}
