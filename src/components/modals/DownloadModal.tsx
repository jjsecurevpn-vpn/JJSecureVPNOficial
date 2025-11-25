/**
 * @file DownloadModal.tsx
 * @description Modal de descarga con información sobre por qué JJSecure VPN es la mejor opción
 */

import React from "react";
import { Modal } from "./Modal";
import {
  Download,
  Tv,
  Smartphone,
  DollarSign,
  Share2,
  MapPin,
  User,
} from "lucide-react";
import type { ModalComponentProps } from "./modalComponents";

export const DownloadModal: React.FC<ModalComponentProps> = ({ onClose }) => {
  const features = [
    {
      icon: Tv,
      title: "MODO TV",
      description: "Adaptación perfecta para televisiones y Smart TV",
    },
    {
      icon: Smartphone,
      title: "MODO MÓVIL",
      description: "Optimizado para tablets y dispositivos móviles",
    },
    {
      icon: DollarSign,
      title: "PRECIOS INIGUALABLES",
      description: "La mejor relación calidad-precio del mercado",
    },
    {
      icon: Share2,
      title: "HOTSPOT SHARING",
      description: "Comparte tu conexión VPN con otros dispositivos",
    },
    {
      icon: MapPin,
      title: "MAPA EN TIEMPO REAL",
      description: "Visualiza latitud y longitud al conectarte",
    },
    {
      icon: User,
      title: "PERFIL EN TIEMPO REAL",
      description: "Todos los datos de tu cuenta actualizados al instante",
    },
  ];

  const additionalFeatures = [
    "Conecta automáticamente",
    "Cambia servidores al instante",
    "Modo oscuro",
    "Notificaciones inteligentes",
    "Y muchas funcionalidades más que hacen de JJSecure la VPN definitiva",
  ];

  const handleDownload = () => {
    window.open(
      "https://play.google.com/store/apps/details?id=com.jjsecure.pro",
      "_blank"
    );
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Download">
      <div className="px-8 py-8 space-y-8 max-h-[75vh] overflow-y-auto scrollbar-hidden">
        {/* Header Section - Más limpio y espacioso */}
        <div className="text-center space-y-3 pb-4 border-b border-gray-800">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            La VPN más completa
          </h1>
          <p className="text-gray-400 text-base max-w-2xl mx-auto">
            Funcionalidades avanzadas diseñadas para tu privacidad y comodidad
          </p>
        </div>

        {/* Features Grid - Diseño más limpio */}
        <div className="grid grid-cols-1 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gray-900/40 rounded-2xl p-4 border border-gray-800 hover:border-blue-500/40 hover:bg-gray-900/60 transition-all duration-300"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <feature.icon className="w-4.5 h-4.5 text-blue-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm mb-1 tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features - Más sutil */}
        <div className="bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5 rounded-2xl p-5 border border-blue-500/10">
          <div className="flex flex-wrap gap-2 justify-center">
            {additionalFeatures.slice(0, 4).map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1.5 bg-gray-900/50 rounded-full text-gray-300 text-xs border border-gray-800"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Download Section - Botón súper llamativo */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>

          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl">
            <div className="text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20">
                <span className="text-green-400 text-sm font-medium">
                  ✓ Descarga gratuita
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  Descarga JJSecure VPN
                </h2>
                <p className="text-gray-400 text-sm">
                  Disponible ahora en Google Play Store
                </p>
              </div>

              {/* Botón principal mejorado */}
              <button
                onClick={handleDownload}
                className="group relative inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-green-500/50 text-base w-full max-w-md mx-auto"
              >
                <Download className="w-6 h-6 animate-bounce group-hover:animate-none" />
                <span className="text-lg">Descargar ahora</span>
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
              </button>

              {/* Info adicional minimalista */}
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500 pt-2">
                <span>Actualizaciones automáticas</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span>Soporte incluido</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
