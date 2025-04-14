import { Card, CardContent } from "@/components/ui/card";

export default function WhyChooseSection({ whyChooseBlock = {} }) {
  const { title = "", text = "", items = [] } = whyChooseBlock;

  return (
    <section className="py-20 my-12">
      <div className="max-w-6xl px-4 mx-auto">
        <h2 className="mb-8 text-3xl font-bold text-[#0a1a33]">{title}</h2>

        <div className="space-y-6">
          <p className="text-gray-700">{text}</p>

          <div className="grid grid-cols-1 gap-4 mt-10 sm:grid-cols-2">
            {items.map((item, index) => (
              <Card
                key={index}
                className="bg-[#a8d0e6] border-none rounded-none"
              >
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2 text-lg font-semibold text-[#0a1a33]">
                    {item}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
