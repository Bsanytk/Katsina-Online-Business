// src/pages/Legal.jsx

import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui";
import BackButton from "../components/BackButton";

const LEGAL_DOCS = [
  {
    title: "Terms of Service",
    path: "/terms",
    icon: "📋",
    version: "KOB-TV-1.0.0",
  },

  {
    title: "Privacy Policy",
    path: "/privacy",
    icon: "🔏",
    version: "KOB-PV-1.0.0",
  },

  {
    title: "KOB Express Delivery",
    path: "/kob-express",
    icon: "🚚",
    version: "Operational",
  },

  {
    title: "Verified Seller System",
    path: "/verified-sellers",
    icon: "🏪",
    version: "Active",
  },

  {
    title: "Marketplace Safety",
    path: "/safety",
    icon: "🛡️",
    version: "Active",
  },

  {
    title: "Community Guidelines",
    path: "/community",
    icon: "👥",
    version: "Draft v0.1",
  },

  {
    title: "Seller Standards",
    path: "/seller-policy",
    icon: "⭐",
    version: "Beta",
  },
];

export default function Legal() {
  const getStatusColor = (version) => {
    if (version.includes("Operational")) {
      return "text-green-700 bg-green-50 border border-green-100";
    }

    if (version.includes("Active")) {
      return "text-blue-700 bg-blue-50 border border-blue-100";
    }

    if (version.includes("Beta")) {
      return "text-yellow-700 bg-yellow-50 border border-yellow-100";
    }

    if (version.includes("Draft")) {
      return "text-orange-700 bg-orange-50 border border-orange-100";
    }

    return "text-kob-primary bg-kob-light border border-kob-primary/10";
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* Top Navigation */}

      <div className="container py-4">
        <BackButton />
      </div>

      {/* Hero Section */}

      <section className="bg-gradient-to-r from-kob-primary via-[#4B3621] to-kob-gold text-white py-20">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">⚖️</div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            KOB Legal Center
          </h1>

          <p className="text-base md:text-lg opacity-90 max-w-3xl mx-auto leading-8">
            Marketplace policies, seller standards, privacy, safety systems and
            compliance frameworks designed to protect buyers, sellers and the
            entire KOB community.
          </p>

          {/* Status */}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold">
              Marketplace Compliance
            </span>

            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold">
              Buyer Protection
            </span>

            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold">
              Seller Standards
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}

      <section className="container max-w-6xl mx-auto px-4 py-16">
        {/* Intro Card */}

        <Card className="p-8 rounded-3xl mb-12 border border-gray-100 shadow-sm bg-white">
          <h2 className="text-2xl font-black text-[#2C1F0E] mb-4">
            Marketplace Trust & Transparency
          </h2>

          <p className="text-gray-600 leading-8 text-base md:text-lg">
            KOB is committed to building a safe, trusted and structured online
            marketplace environment for both buyers and sellers across our
            growing digital community. These policies and operational systems
            help maintain transparency, accountability and marketplace
            integrity.
          </p>
        </Card>

        {/* Legal Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEGAL_DOCS.map((doc) => (
            <Link key={doc.title} to={doc.path} className="group">
              <Card
                className="
                  bg-white
                  rounded-3xl
                  border border-gray-100
                  shadow-sm
                  p-6
                  h-full
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all
                  duration-300
                  overflow-hidden
                "
              >
                {/* Icon */}

                <div
                  className="
                  text-5xl
                  mb-5
                  group-hover:scale-110
                  transition-transform
                  duration-300
                "
                >
                  {doc.icon}
                </div>

                {/* Title */}

                <h3
                  className="
                  text-xl
                  font-black
                  text-[#2C1F0E]
                  mb-3
                  group-hover:text-kob-primary
                  transition-colors
                "
                >
                  {doc.title}
                </h3>

                {/* Description */}

                <p className="text-sm text-gray-500 leading-7 mb-5">
                  Access marketplace rules, operational standards, safety
                  systems and compliance information related to this section of
                  the KOB ecosystem.
                </p>

                {/* Version Badge */}

                <span
                  className={`
                    inline-flex
                    items-center
                    px-3
                    py-1.5
                    rounded-full
                    text-xs
                    font-bold
                    ${getStatusColor(doc.version)}
                  `}
                >
                  {doc.version}
                </span>
              </Card>
            </Link>
          ))}
        </div>

        {/* Trust Badges */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            "Buyer Protection",
            "Verified Sellers",
            "Privacy Protected",
            "Secure Marketplace",
          ].map((item) => (
            <Card
              key={item}
              className="
                p-5
                text-center
                rounded-2xl
                border border-gray-100
                shadow-sm
                bg-white
              "
            >
              <p className="font-semibold text-[#2C1F0E] text-sm md:text-base">
                ✅ {item}
              </p>
            </Card>
          ))}
        </div>

        {/* Legal Notice */}

        <Card
          className="
            mt-16
            p-8
            rounded-3xl
            border border-yellow-100
            bg-yellow-50
          "
        >
          <h2 className="text-2xl font-black text-yellow-900 mb-4">
            ⚠️ Important Legal Notice
          </h2>

          <p className="text-yellow-800 leading-8 text-base md:text-lg">
            By using the KOB Marketplace platform, users agree to comply with
            marketplace rules, seller standards, community guidelines and safety
            policies. KOB reserves the right to remove fraudulent, misleading or
            harmful content in order to maintain trust and protect the
            marketplace ecosystem.
          </p>
        </Card>

        {/* Footer Disclaimer */}

        <div
          className="
          mt-16
          p-8
          bg-white
          rounded-3xl
          border border-gray-100
          shadow-sm
          text-center
        "
        >
          <p className="text-gray-600 leading-8 text-sm md:text-base">
            Legal documents and marketplace systems are continuously reviewed
            and updated by the
            <span className="font-bold text-[#2C1F0E]">
              {" "}
              KOB Legal, Safety & Compliance Team
            </span>{" "}
            to improve marketplace trust, transparency, buyer protection and
            seller accountability.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="text-xs bg-kob-light text-kob-primary px-3 py-1 rounded-full font-semibold">
              KOB-TV-1.0.0
            </span>

            <span className="text-xs bg-kob-light text-kob-primary px-3 py-1 rounded-full font-semibold">
              KOB-PV-1.0.0
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
