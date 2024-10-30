import { Variants } from "framer-motion";

export interface Step {
  text: string;
}

export const steps: Step[] = [
  { text: "Duyệt qua bộ sưu tập cây cảnh đa dạng từ nhiều nhà cung cấp." },
  { text: "Liên hệ với người bán để được tư vấn chuyên sâu và đặt câu hỏi." },
  { text: "Đặt hàng và sắp xếp giao nhận hoặc nhận tại cửa hàng." },
  { text: "Nhận cây cảnh và bắt đầu tận hưởng không gian xanh mới của bạn!" },
];

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};
