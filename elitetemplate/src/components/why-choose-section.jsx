import { Card, CardContent } from "@/components/ui/card";

export default function WhyChooseSection({ whyChooseBlock = {} }) {
  const { title = "", text = "", items = [] } = whyChooseBlock;

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-[#0a1a33]">
          {title}
        </h2>

        <div className="mx-auto max-w-3xl space-y-6">
          <p className="text-gray-700">{text}</p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((benefit, index) => (
              <Card key={index} className="bg-[#a8d0e6] border-none">
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2 text-lg font-semibold text-[#0a1a33]">
                    {benefit.title}
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
