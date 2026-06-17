import HeroBannerSlider from "@/components/home/hero/HeroBannerSlider";
import { bannersService } from "@/services/banners.service";

export default async function HeroSection() {
  const bannersResponse = await bannersService
    .getPublicByPage("home")
    .catch(() => null);

  const banners = bannersResponse?.data?.banners ?? [];

  return (
    <section className="relative min-h-[min(88vh,760px)] w-full overflow-hidden">
      <HeroBannerSlider banners={banners} />
    </section>
  );
}
