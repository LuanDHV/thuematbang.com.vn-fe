import Banner from "@/components/cho-thue/Banner";
import ByFilter from "@/components/cho-thue/ByFilter";
import ContentSEO from "@/components/cho-thue/ContentSEO";
import FAQ from "@/components/cho-thue/FAQ";

//Tạm thời dùng dữ liệu từ cho thuê cho đến khi sử dụng data thật
export default function CanThuePage() {
  return (
    <>
      <Banner />
      <ByFilter />
      <ContentSEO />
      <FAQ />
    </>
  );
}
