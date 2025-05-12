
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
  actionButton?: ReactNode;
}

const DashboardCard = ({
  title,
  icon,
  className,
  children,
  actionButton
}: DashboardCardProps) => {
  return (
    <Card className={cn('overflow-hidden shadow-md hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="bg-muted/50 flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {icon && <div className="text-primary">{icon}</div>}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        {actionButton && <div>{actionButton}</div>}
      </CardHeader>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
