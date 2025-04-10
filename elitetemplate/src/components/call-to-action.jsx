export default function CallToAction({ text }) {
  return (
    <section className="bg-[#F3F3F3] py-16 md:min-h-64">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-[#0a1a33]">{text}</h2>
        </div>
      </div>
    </section>
  );
}
