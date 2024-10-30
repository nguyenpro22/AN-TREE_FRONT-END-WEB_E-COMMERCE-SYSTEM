import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
}

function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <Card className="bg-white text-green-800 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-2">
        <Quote className="h-8 w-8 text-green-600 mb-2" />
        <CardTitle className="text-lg font-semibold leading-tight">
          &ldquo;{quote}&rdquo;
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium text-green-700">{author}</p>
        {role && <p className="text-sm text-green-600">{role}</p>}
      </CardContent>
    </Card>
  );
}

export default function Testimonials() {
  return (
    <section
      id="đánh-giá"
      className="bg-gradient-to-b from-green-50 to-white py-20"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-4">
          Khách Hàng Nói Gì Về Chúng Tôi
        </h2>
        <p className="text-center text-green-600 mb-12 max-w-2xl mx-auto">
          Khám phá trải nghiệm của những người yêu cây đã tìm thấy niềm đam mê
          của họ thông qua Antree
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            quote="Antree giúp tôi dễ dàng tìm được cây phong Nhật Bản hoàn hảo cho khu vườn của mình. Lời khuyên từ người bán thật vô giá!"
            author="Lan Anh"
            role="Chủ nhà vườn"
          />
          <TestimonialCard
            quote="Là chủ một vườn ươm nhỏ, Antree đã giúp tôi tiếp cận được nhiều khách hàng hơn. Thật tuyệt vời cho việc kinh doanh!"
            author="Minh Tuấn"
            role="Chủ Vườn Ươm Xanh Tươi"
          />
          <TestimonialCard
            quote="Tôi thích cách có thể duyệt qua nhiều loại cây cảnh và kết nối trực tiếp với người bán am hiểu. Antree là thiên đường cho người yêu cây!"
            author="Hương Giang"
            role="Người yêu cây"
          />
        </div>
      </div>
    </section>
  );
}
