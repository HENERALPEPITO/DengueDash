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
      <div className="h-[15vh] px-6 py-7">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">{title}</h1>
          <Icon icon={icon} className="text-2xl" />
        </div>
        <p className="mt-3 text-3xl font-medium">{value}</p>
      </div>
    </Card>
  );
}
