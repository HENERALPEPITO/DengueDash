type ChartHeaderProps = {
  title: string;
  date: string;
};

export default function ChartHeader({ title, date }: ChartHeaderProps) {
  return (
    <div className="p-4 border-b border-gray">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-gray-600">As of {date}</p>
    </div>
  );
}
