import { ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Props {
  children: ReactNode[];
  slidesDesktop?: number;
  slidesTablet?: number;
}

export default function CardCarousel({ children, slidesDesktop = 3, slidesTablet = 2 }: Props) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={24}
      slidesPerView={1.08}
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        640: { slidesPerView: slidesTablet },
        1024: { slidesPerView: slidesDesktop },
      }}
      className="card-carousel"
    >
      {children.map((child, i) => (
        <SwiperSlide key={i}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
}
