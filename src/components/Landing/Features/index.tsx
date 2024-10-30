import { ShoppingBag, Users, Sprout } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="text-center hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="mx-auto">{icon}</div>
        <CardTitle className="text-xl font-semibold text-green-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-green-700">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default function Features() {
  return (
    <section id="tính-năng" className="bg-white py-20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-green-800 mb-12">
          Tại Sao Chọn Antree?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<ShoppingBag className="h-12 w-12 text-green-600" />}
            title="Đa Dạng Lựa Chọn"
            description="Khám phá bộ sưu tập cây cảnh phong phú từ các nhà cung cấp uy tín trên toàn quốc."
          />
          <FeatureCard
            icon={<Users className="h-12 w-12 text-green-600" />}
            title="Tư Vấn Chuyên Nghiệp"
            description="Kết nối với các chuyên gia để được hướng dẫn chọn lựa cây cảnh phù hợp nhất."
          />
          <FeatureCard
            icon={<Sprout className="h-12 w-12 text-green-600" />}
            title="Đảm Bảo Chất Lượng"
            description="Mọi cây cảnh trên nền tảng đều được kiểm tra kỹ lưỡng để đảm bảo sức khỏe và sự phát triển."
          />
        </div>
      </div>
    </section>
  );
}
