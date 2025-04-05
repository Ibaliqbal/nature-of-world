import NatureClient from "@/components/nature-client";
import SmoothScroll from "@/components/smooth-scroll";
import { natures } from "@/config/constant";

export async function generateStaticParams() {
  return natures.map((nature) => ({
    nature: nature.slug,
  }));
}

const page = async ({ params }) => {
  const { nature } = await params;
  const currentNature = natures.find((n) => n.slug === nature);
  const currentNatureIndex = natures.findIndex((n) => n.slug === nature);
  const prevNatureIndex =
    (currentNatureIndex - 1 + natures.length) % natures.length;
  const nextNatureIndex = (currentNatureIndex + 1) % natures.length;

  const prevNature = natures[prevNatureIndex];
  const nextNature = natures[nextNatureIndex];
  return (
    <SmoothScroll>
      <NatureClient
        currentNature={currentNature}
        prevNature={prevNature}
        nextNature={nextNature}
      />
    </SmoothScroll>
  );
};

export default page;
