import { notFound } from "next/navigation";
import { getCafe, getAllSlugs } from "@/cafes.config";
import CafeFalPage from "@/components/CafeFalPage";
import type { Metadata } from "next";

// Build anında tüm slug'ları statik olarak üret
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ cafe: slug }));
}

// Her kafe için ayrı SEO metadata
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ cafe: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { cafe: slug } = await params;
  const config = getCafe(slug);
  if (!config) return { title: "Bulunamadı" };

  const resolvedSearchParams = await searchParams;
  const customName = typeof resolvedSearchParams.name === "string" ? resolvedSearchParams.name : null;
  const pageTitle = customName ? `${customName} – AI Kahve Falı` : config.pageTitle;

  return {
    title: pageTitle,
    description: config.metaDescription,
  };
}

export default async function CafePage({
  params,
  searchParams,
}: {
  params: Promise<{ cafe: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { cafe: slug } = await params;
  const baseConfig = getCafe(slug);

  // Tanımsız slug → 404
  if (!baseConfig) notFound();

  // Search parametresinden özel isim gelmişse config'i ez
  const resolvedSearchParams = await searchParams;
  const customName = typeof resolvedSearchParams.name === "string" ? resolvedSearchParams.name : null;
  
  const config = {
    ...baseConfig,
    name: customName || baseConfig.name,
    // Eğer özel bir isim verilmişse taglineda da hissettirebiliriz, ama şimdilik sadece ana isim değişsin.
  };

  return <CafeFalPage config={config} />;
}
