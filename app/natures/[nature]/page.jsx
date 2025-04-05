import { mainNature } from "@/config/constant";
import Link from "next/link";

export async function generateStaticParams() {
  return mainNature.map((nature) => ({
    nature: nature.slug,
  }));
}

const page = async ({ params }) => {
  const { nature } = await params;
  return (
    <main>
      <Link href={"/"}>Go back</Link>
      Hello world {nature}
    </main>
  );
};

export default page;
