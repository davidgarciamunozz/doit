import Image from "next/image";
import Link from "next/link";
import { Package, ShoppingCart, BookOpen, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <main className="relative w-full flex items-center justify-center min-h-[600px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing/Banner (3).png"
            alt="Banner background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 px-4 max-w-5xl w-full flex flex-col items-center text-center -mt-52 md:-mt-60">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-4">
            Finanzas simplificadas
            <br />
            <span className="font-normal text-black">para</span>{" "}
            <span className="text-[#D3F36B]">pastelerias</span>
          </h1>
          <p className="text-base md:text-lg text-[#827E94] max-w-2xl">
            Gestiona los ingresos y gastos de tu pastelería de manera sencilla.
            Genera reportes financieros y obtén insights valiosos para hacer
            crecer tu negocio
          </p>
        </div>
      </main>

      {/* Background Section */}
      <section className="relative w-full flex items-center justify-center min-h-[600px] pt-16 md:pt-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing/Background.png"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-6xl text-center py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Todo lo que necesitas para gestionar tu pasteleria
          </h2>
          <p className="text-base md:text-lg text-[#827E94] mb-12">
            Herramientas diseñadas específicamente para las necesidades
            financieras de pastelerías y reposterías
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {/* Card 1 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg text-left">
              <div className="w-12 h-12 bg-[#D3F36B] rounded-lg flex items-center justify-center mb-4">
                <Package className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                Smart Inventory
              </h3>
              <p className="text-sm text-gray-700">
                Keeps track of supplies and finished products with real-time
                low-stock alerts to optimize resources.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg text-left">
              <div className="w-12 h-12 bg-[#D3F36B] rounded-lg flex items-center justify-center mb-4">
                <ShoppingCart className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                Automated Order Management
              </h3>
              <p className="text-sm text-gray-700">
                Creates and tracks customer orders, updates stock automatically,
                and generates invoices.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg text-left">
              <div className="w-12 h-12 bg-[#D3F36B] rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                Linked Digital Recipe Book
              </h3>
              <p className="text-sm text-gray-700">
                Connects recipes with inventory and automatically calculates
                costs and yields.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg text-left">
              <div className="w-12 h-12 bg-[#D3F36B] rounded-lg flex items-center justify-center mb-4">
                <BarChart className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">
                Real-Time Reports
              </h3>
              <p className="text-sm text-gray-700">
                Provides dashboards with key indicators and exportable reports
                for quick, data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mockup Section */}
      <section className="relative w-full flex items-center justify-center min-h-[600px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing/Mockup background.png"
            alt="Mockup background"
            fill
            className="object-cover"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center px-4 w-full ml-[35%] pl-6 pr-55 max-w-4xl text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
            Toma decisiones informadas para hacer crecer tu pastelería
          </h2>
          <p className="text-base md:text-lg text-black text-left">
            Con Doit, tendrás toda la información financiera que necesitas para
            optimizar tu negocio y aumentar la rentabilidad de tu pastelería
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full flex flex-col items-center justify-center py-16 md:py-24 px-4">
        <div className="max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            ¿Listo para llevar las finanzas de tu pastelería al siguiente nivel?
          </h2>
          <p className="text-base md:text-lg text-[#827E94] mb-8">
            Regístrate gratis y comienza a usar Doit para gestionar tu negocio
            sin complicaciones.
          </p>
          <div className="flex justify-center">
            <Link href="/auth/sign-up">
              <Button className="w-50 rounded-lg bg-[#D3F36B] text-black font-semibold px-8 py-3 hover:bg-[#C7ED4F]">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
