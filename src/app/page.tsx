import Image from "next/image";
import Link from "next/link";
import { Package, ShoppingCart, BookOpen, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <main
        className="relative w-full flex items-center justify-center 
       min-h-[500px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[650px] xl:min-h-[700px]"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing/Banner (3).png"
            alt="Banner background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Content Overlay */}
        <div
          className="
    relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl w-full
    flex flex-col items-center text-center
    pt-6 sm:pt-8 md:pt-10 lg:pt-12
    -mt-32 sm:-mt-40 md:-mt-52 lg:-mt-64
  "
        >
          <h1
            className="
      text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
      font-bold text-black leading-tight
      mb-2 sm:mb-3 md:mb-4
    "
          >
            Finanzas simplificadas
            <br />
            <span className="font-normal text-black">para</span>{" "}
            <span className="text-[#D3F36B]">pastelerias</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#827E94] max-w-2xl px-2 sm:px-4">
            Gestiona los ingresos y gastos de tu pastelería de manera sencilla.
            Genera reportes financieros y obtén insights valiosos para hacer
            crecer tu negocio
          </p>
        </div>
      </main>

      {/* Background Section */}
      <section className="relative w-full flex items-center justify-center min-h-[500px] sm:min-h-[600px] md:min-h-[700px] pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing/Background.png"
            alt="Background"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 w-full max-w-6xl text-center py-8 sm:py-10 md:py-12 lg:py-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-3 sm:mb-4 md:mb-5 px-2 sm:px-4">
            Todo lo que necesitas para gestionar tu pasteleria
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#827E94] mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-2 sm:px-4">
            Herramientas diseñadas específicamente para las necesidades
            financieras de pastelerías y reposterías
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 w-full max-w-4xl">
            {/* Card 1 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 sm:p-5 md:p-6 shadow-lg text-left w-full">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#D3F36B] rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Package className="text-black w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-2 sm:mb-3">
                Smart Inventory
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                Keeps track of supplies and finished products with real-time
                low-stock alerts to optimize resources.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 sm:p-5 md:p-6 shadow-lg text-left w-full">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#D3F36B] rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <ShoppingCart className="text-black w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-2 sm:mb-3">
                Automated Order Management
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                Creates and tracks customer orders, updates stock automatically,
                and generates invoices.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 sm:p-5 md:p-6 shadow-lg text-left w-full">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#D3F36B] rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <BookOpen className="text-black w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-2 sm:mb-3">
                Linked Digital Recipe Book
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                Connects recipes with inventory and automatically calculates
                costs and yields.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 sm:p-5 md:p-6 shadow-lg text-left w-full">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-[#D3F36B] rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <BarChart className="text-black w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-2 sm:mb-3">
                Real-Time Reports
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                Provides dashboards with key indicators and exportable reports
                for quick, data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mockup Section */}
      <section className="relative w-full flex items-center justify-center min-h-[350px] sm:min-h-[450px] md:min-h-[550px] lg:min-h-[650px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing/Mockup background.png"
            alt="Mockup background"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 w-full max-w-4xl text-center md:text-left py-8 sm:py-10 md:py-12 lg:py-16 md:ml-0 lg:ml-[30%] xl:ml-[35%]">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-black mb-3 sm:mb-4 md:mb-5">
            Toma decisiones informadas para hacer crecer tu pastelería
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-black leading-relaxed">
            Con Doit, tendrás toda la información financiera que necesitas para
            optimizar tu negocio y aumentar la rentabilidad de tu pastelería
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full flex flex-col items-center justify-center py-10 sm:py-14 md:py-18 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-3 sm:mb-4 md:mb-5 px-2 sm:px-4">
            ¿Listo para llevar las finanzas de tu pastelería al siguiente nivel?
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#827E94] mb-6 sm:mb-8 md:mb-10 px-2 sm:px-4 leading-relaxed">
            Regístrate gratis y comienza a usar Doit para gestionar tu negocio
            sin complicaciones.
          </p>
          <div className="flex justify-center">
            <Link href="/auth/sign-up" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto rounded-lg bg-[#D3F36B] text-black font-semibold px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 text-sm sm:text-base md:text-lg hover:bg-[#C7ED4F] transition-colors">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
