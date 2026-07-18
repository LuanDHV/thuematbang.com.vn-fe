"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.15,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

function parseStatValue(value: string) {
  const numericPart = value.replace(/[^\d]/g, "");
  const suffix = value.replace(/[\d.,\s]/g, "");

  return {
    suffix,
    target: Number(numericPart || 0),
  };
}

function StatCountUp({ value }: { value: string }) {
  const { suffix, target } = parseStatValue(value);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasStarted(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.4,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const duration = 1100;
    const start = performance.now();
    let frameId = 0;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(frameId);
  }, [hasStarted, target]);

  const formatter = new Intl.NumberFormat("vi-VN");
  const animatedValue = `${formatter.format(count)}${suffix}`;
  const staticValue = `${formatter.format(target)}${suffix}`;

  return (
    <span ref={ref} className="tabular-nums">
      <span className="motion-reduce:hidden">{animatedValue}</span>
      <span className="motion-safe:hidden">{staticValue}</span>
    </span>
  );
}

function BlockHeading({ title }: { title: string }) {
  return (
    <Reveal>
      <h3 className="text-primary text-center text-lg font-semibold tracking-[0.20em] uppercase">
        {title}
      </h3>
    </Reveal>
  );
}

function ImageFrame({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "aspect-4/3 overflow-hidden rounded-xl lg:aspect-auto lg:h-full",
        className,
      )}
    >
      <div className="relative h-full min-h-[220px] lg:min-h-full">
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    </div>
  );
}

const timelineItems = [
  {
    year: "2014",
    title: "Khởi điểm",
    description:
      "Thành lập công ty chuyên cung cấp dịch vụ tư vấn pháp lý và giải pháp cho thuê bất động sản thương mại.",
  },
  {
    year: "2016",
    title: "Phát triển",
    description:
      "Website Thuematbang.com.vn đạt hơn 5 triệu lượt tìm kiếm mỗi tháng, mở rộng sức ảnh hưởng của nền tảng.",
  },
  {
    year: "2019",
    title: "Mở rộng",
    description:
      "Tư vấn bất động sản với độ bao phủ toàn quốc, đại diện phát triển thương hiệu cho hơn 100 thương hiệu và doanh nghiệp.",
  },
  {
    year: "2021",
    title: "Tái cấu trúc",
    description:
      "Tái cơ cấu bộ máy công ty, phát huy toàn diện năng lực từng phòng ban và cán bộ chủ chốt.",
  },
  {
    year: "2025",
    title: "Phát triển bền vững",
    description:
      "Tự hào là công ty cung cấp giải pháp cho thuê bất động sản thương mại hàng đầu tại thị trường Việt Nam.",
  },
] as const;

const statCards = [
  {
    primary: "10.000+",
    label: "Bất động sản cho thuê",
  },
  {
    primary: "200+",
    label: "Đối tác, khách hàng",
  },
  {
    primary: "15+",
    label: "Kinh nghiệm",
  },
  {
    primary: "5+",
    label: "Dịch vụ",
  },
] as const;

export function AboutPageHero() {
  return (
    <section className="layout-section">
      <Reveal>
        <h1 className="text-heading text-center text-2xl font-bold uppercase md:text-3xl">
          Tầm nhìn và sứ mệnh
        </h1>
      </Reveal>
    </section>
  );
}

export function AboutPageOverview() {
  return (
    <section className="layout-section">
      <BlockHeading title="Giới thiệu" />

      <div className="mt-8 grid gap-6 lg:grid-cols-[4fr_6fr] lg:gap-8">
        <Reveal delay={80}>
          <ImageFrame
            src="/imgs/fallback.png"
            alt="Khung hình minh họa về không gian thương mại và hoạt động của thương hiệu"
            className="h-full"
          />
        </Reveal>

        <Reveal delay={160}>
          <article className="surface-panel flex h-full flex-col justify-between p-5">
            <div className="space-y-4">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
                Công ty TNHH Dịch vụ Quảng cáo Thuematbang.com.vn
              </p>
              <h2 className="text-heading text-xl leading-tight font-semibold tracking-[-0.04em] md:text-2xl">
                Công nghệ, dữ liệu và dịch vụ cùng phục vụ nhu cầu bất động sản
                thương mại
              </h2>
              <p className="text-secondary text-sm leading-7 md:text-base">
                Trong kỷ nguyên hiện đại, công nghệ online trở thành công cụ hỗ
                trợ không thể thiếu đối với hầu hết người dùng.
                Thuematbang.com.vn được xây dựng để đáp ứng nhu cầu tìm kiếm,
                mong muốn cho thuê và cần thuê bất động sản.
              </p>
              <p className="text-secondary text-sm leading-7 md:text-base">
                Mỗi tháng, hệ thống ghi nhận hơn 150 nghìn tin rao mới và hơn 2
                triệu lượt khách hàng xem tin trên trang. Với gần 10 năm phát
                triển tại thị trường Việt Nam, chúng tôi tiếp tục đầu tư mạnh mẽ
                hơn vào công nghệ để trở thành người cố vấn đáng tin cậy cho
                người tìm kiếm bất động sản.
              </p>
              <p className="text-secondary text-sm leading-7 md:text-base">
                Với lịch sử phát triển gần 10 năm tại thị trường Việt Nam,
                Thuematbang.com.vn hiện được điều hành bởi Công ty TNHH Dịch vụ
                Quảng cáo Thuematbang.com.vn – là công ty thành viên của
                Aconnection Group, một tập đoàn đang sở hữu các nền tảng công
                nghệ bất động sản chất lượng cao. Thuematbang.com.vn đang và sẽ
                đầu tư mạnh mẽ hơn nữa vào công nghệ cho tầm nhìn trở thành
                “người cố vấn” đáng tin cậy đối với những người tìm kiếm bất
                động sản.
              </p>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

export function AboutPageTimeline() {
  return (
    <section className="layout-section">
      <BlockHeading title="Lịch sử hình thành" />

      <div className="relative mt-8 md:mt-12 lg:mt-14">
        <div className="bg-primary/20 absolute top-0 bottom-0 left-3.5 w-px md:left-4 lg:left-1/2 lg:-translate-x-px" />
        <div className="space-y-4 md:space-y-5 lg:space-y-4">
          {timelineItems.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.year}
                className="relative grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-4 md:grid-cols-[2.5rem_minmax(0,1fr)] md:gap-5 lg:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] lg:items-center"
              >
                <div className="relative z-10 flex justify-center pt-1 md:pt-1.5 lg:col-start-2 lg:pt-3">
                  <span className="relative flex size-4 shrink-0">
                    <span className="bg-primary/35 absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
                    <span className="bg-primary relative inline-flex size-4 rounded-full" />
                  </span>
                </div>

                <div
                  className={cn(
                    "col-start-2 md:col-start-2 lg:row-start-1",
                    isEven
                      ? "lg:col-start-1 lg:w-[calc(100%-1.5rem)] lg:max-w-2xl lg:justify-self-end lg:text-right"
                      : "lg:col-start-3 lg:justify-self-start lg:text-left",
                  )}
                >
                  <Reveal delay={index * 90}>
                    <article
                      className={cn(
                        "surface-card w-full max-w-none p-5 md:p-6 lg:max-w-xl",
                        isEven ? "lg:text-right" : "lg:text-left",
                      )}
                    >
                      <div
                        className={cn(
                          "flex flex-wrap items-baseline gap-x-3 gap-y-1",
                          isEven ? "lg:justify-end" : "lg:justify-start",
                        )}
                      >
                        <h3 className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
                          {item.year} - {item.title}
                        </h3>
                      </div>

                      <p className="text-secondary mt-3 text-sm leading-7 md:text-base">
                        {item.description}
                      </p>
                    </article>
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AboutPageLeadership() {
  return (
    <section className="layout-section">
      <BlockHeading title="Ban lãnh đạo" />

      <div className="mt-8 grid gap-6 lg:grid-cols-[6fr_4fr] lg:gap-8">
        <Reveal delay={100} className="order-2 lg:order-1">
          <article className="surface-panel flex h-full flex-col justify-between p-5">
            <div className="space-y-4">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
                A-Connection Group
              </p>
              <h2 className="text-heading text-xl leading-tight font-semibold tracking-[-0.04em] md:text-2xl">
                Hệ sinh thái giải pháp bất động sản thương mại toàn diện
              </h2>
              <p className="text-secondary text-sm leading-7 md:text-base">
                A-Connection Group tự hào là nhà cung cấp giải pháp toàn diện về
                tư vấn cho thuê, tư vấn đầu tư và quản lý tài sản. Tập đoàn đã
                và đang khẳng định vị thế phát triển tại thị trường Việt Nam.
              </p>
              <p className="text-secondary text-sm leading-7 md:text-base">
                Văn hóa doanh nghiệp được xây dựng theo nét riêng biệt, tạo ra
                môi trường làm việc lý tưởng với đội ngũ nhân viên tận tâm, yêu
                nghề và luôn lấy khách hàng làm trọng tâm.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="bg-accent-soft text-primary rounded-full px-4 py-2 text-sm font-semibold">
                CEO. Huỳnh Ngọc Bích
              </span>
            </div>
          </article>
        </Reveal>

        <Reveal delay={180} className="order-1 lg:order-2">
          <ImageFrame
            src="/imgs/CEO.png"
            alt="Khung chân dung minh họa cho ban lãnh đạo Thuematbang.com.vn"
            className="h-full"
          />
        </Reveal>
      </div>
    </section>
  );
}

export function AboutPageReasonsStats() {
  return (
    <section className="layout-section">
      <BlockHeading title="Lý do chọn chúng tôi" />

      <Reveal delay={280}>
        <div className="mt-8 gap-6">
          <div className="border-hairline bg-surface rounded-xl border p-5">
            <p className="text-secondary mt-4 text-base leading-relaxed">
              Với đội ngũ nhân viên môi giới và khách quan về thị trường bất
              động sản luôn tin tưởng lựa chọn Thuematbang.com.vn làm công cụ hỗ
              trợ trong việc tìm kiếm khách hàng và tìm kiếm thông tin về bất
              động sản, và tin tức được phản ánh nhanh chóng, chính xác và đầy
              đủ nhất.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((stat, index) => (
                <Reveal key={stat.label} delay={index * 60}>
                  <article className="group border-hairline bg-surface relative overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
                    <div className="bg-primary absolute top-0 left-0 h-full w-1" />
                    <div className="space-y-3 pl-3">
                      <p className="text-primary text-4xl leading-none font-semibold tracking-tighter md:text-5xl">
                        <StatCountUp value={stat.primary} />
                      </p>
                      <p className="text-heading text-sm leading-snug font-semibold md:text-base">
                        {stat.label}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
