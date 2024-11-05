import { Card } from "@/shadcn/components/ui/card";

type StatCardProps = {
  title: string;
  value: string;
  icon: string;
};

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <Card className="w-full">
      <div className="h-[15vh]">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">{title}</h1>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}
