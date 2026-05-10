import { client } from "@/sanity/lib/client";
import ProductPage from "@/components/ProductPage/ProductPage";
import { notFound } from "next/navigation";

async function getProductData(slug: string) {
  // Το Query τραβάει τα URLs για την κύρια εικόνα ΚΑΙ τη gallery
  const query = `*[_type == "product" && slug.current == $slug][0]{
    "title": name,
    "category": categories[0]->title,
    sku,
    price,
    "shortDesc": shortDescription,
    "longDesc": longDescription,
    weight,
    dimensions,
    "imageUrl": mainImage.asset->url,
    "gallery": gallery[].asset->url,
    "variants": variants[]{
      variantTitle,
      variantSku,
      variantPrice,
      variantWeight,
      variantDimensions
    }
  }`;
  return await client.fetch(query, { slug });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductData(resolvedParams.slug);

  if (!product) notFound();

  return <ProductPage initialProduct={product} />;
}