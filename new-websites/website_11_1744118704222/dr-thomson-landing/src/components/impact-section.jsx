import { Card, CardContent } from "@/components/ui/card";

export default function ImpactSection({ statBlock }) {
  const { title, items } = statBlock;

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-[#0a1a33]">
          {title}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {items.map(({ total, text }, index) => (
            <Card key={index} className="bg-[#a8d0e6] border-none">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <p className="text-2xl font-bold text-[#0a1a33]">{total}</p>
                <p className="text-sm text-[#0a1a33]">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
