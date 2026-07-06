import HeroBannerSlider from "@/components/home/hero/HeroBannerSlider";
import { bannersService } from "@/services/banners.service";

const HOME_BANNERS_REVALIDATE_SECONDS = 300;

export default async function HeroSection() {
  const bannersResponse = await bannersService
    .getPublicByPage("home", {
      cache: "force-cache",
      revalidate: HOME_BANNERS_REVALIDATE_SECONDS,
      tags: ["banners", "banners-home", "homepage-banners"],
    })
    .catch(() => null);

  const banners = bannersResponse?.data?.banners ?? [];

  return (
    <section className="relative min-h-[88svh] w-full overflow-hidden md:min-h-screen">
      <HeroBannerSlider banners={banners} />
    </section>
  );
}
