import { Card } from "@/shadcn/components/ui/card";
import { Icon } from "@iconify/react/dist/iconify.js";

type StatCardProps = {
  title: string;
  value: string;
  icon: string;
};

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card className="w-full">
      <div className="h-[12vh] px-3 lg:px-6 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-sm lg:text-lg font-semibold">{title}</h1>
          <Icon icon={icon} className="text-2xl" />
        </div>
        <p className="text-2xl lg:text-3xl font-medium mt-1 lg:mt-3">{value}</p>
      </div>
    </Card>
  );
}
