import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { cn } from "../lib/utils";
import { Skeleton } from "./skeleton";

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  loading?: boolean;
  error?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  loading = false,
  error = false,
  icon,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>
          {loading ? <Skeleton className="h-5 w-[100px]" /> : title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground">
            {loading ? <Skeleton className="h-4 w-4" /> : icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-8 w-[100px] mb-2" />
            <Skeleton className="h-4 w-[140px]" />
          </>
        ) : error ? (
          <div className="text-red-500 text-sm">Failed to load</div>
        ) : (
          <>
            <div className="text-2xl font-bold pb-2">{value}</div>
            <CardDescription>{description}</CardDescription>
          </>
        )}
      </CardContent>
    </Card>
  );
}
