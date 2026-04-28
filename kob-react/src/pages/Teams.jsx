import React from "react";
import { useTranslation } from "../hooks/useTranslation";
import { Card } from "../components/ui";
import BackButton from "../components/BackButton";

export default function Teams() {
  const t = useTranslation();

  const teamMembers = [
    {
      id: 1,
      name: "Sulaiman Babangida Sani",
      role: "Founder & CEO",
      bio: "Digital entrepreneur with 5+ years in e-commerce and startup ecosystem.",
      avatar: "👨‍💼",
    },
    {
      id: 2,
      name: "Abdulmutallib Auwal",
      role: "Head of Operations",
      bio: "Operations expert ensuring smooth marketplace function and seller success.",
      avatar: "👩‍💼",
    },
    {
      id: 3,
      name: "Bello Umar Bello",
      role: "Lead Developer",
      bio: "Full-stack engineer building scalable, modern marketplace technology.",
      avatar: "👨‍💻",
    },
    {
      id: 4,
      name: "Zainab MLadan",
      role: "Community Manager",
      bio: "Supporting buyers and sellers, building a thriving marketplace community.",
      avatar: "👩‍🤝‍👨",
    },
  ];

  return (
    <main className="min-h-screen bg-kob-light">
      <div className="container py-4">
        <BackButton />
      </div>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-kob-primary to-kob-gold text-white py-16 md:py-20">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Our Team</h1>
          <p className="text-xl md:text-2xl opacity-95 font-light max-w-3xl mx-auto">
            Passionate individuals working to revolutionize e-commerce in
            Katsina and beyond.
          </p>
        </div>
      </div>

      <div className="container py-16 md:py-24">
        {/* Mission Section */}
        <Card variant="elevated" className="p-10 md:p-12 mb-16 rounded-2xl">
          <h2 className="text-4xl font-bold text-kob-dark mb-6">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            At Katsina Online Business (KOB), we're committed to empowering
            local entrepreneurs and connecting buyers and sellers in a secure,
            transparent digital marketplace. We believe in the potential of
            small and medium businesses to thrive with the right technology and
            support.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our team is dedicated to building trust, ensuring fair competition,
            and providing world-class service to all our users.
          </p>
        </Card>

        {/* Team Grid */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-kob-dark mb-10 text-center">
            Meet the Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                variant="elevated"
                className="p-8 rounded-xl text-center card-hover animate-fade-in"
              >
                <div className="text-8xl mb-5 inline-block">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-bold text-kob-dark mb-2">
                  {member.name}
                </h3>
                <p className="text-kob-primary font-bold text-base mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 text-base leading-relaxed">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-kob-dark mb-10 text-center">
            Our Core Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="elevated" className="p-8 rounded-xl card-hover">
              <div className="text-6xl mb-5 inline-block">🤝</div>
              <h3 className="text-2xl font-bold text-kob-dark mb-3">
                Trust & Transparency
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                We build trust through transparent operations and fair treatment
                of all users.
              </p>
            </Card>
            <Card variant="elevated" className="p-8 rounded-xl card-hover">
              <div className="text-6xl mb-5 inline-block">🚀</div>
              <h3 className="text-2xl font-bold text-kob-dark mb-3">
                Innovation
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                We continuously innovate to improve the marketplace experience
                for everyone.
              </p>
            </Card>
            <Card variant="elevated" className="p-8 rounded-xl card-hover">
              <div className="text-6xl mb-5 inline-block">💪</div>
              <h3 className="text-2xl font-bold text-kob-dark mb-3">
                Empowerment
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                We empower entrepreneurs with tools and support to succeed
                online.
              </p>
            </Card>
          </div>
        </div>

        {/* Recruitment Section */}
        <div className="bg-gradient-to-br from-kob-primary via-kob-primary-light to-kob-gold text-white rounded-2xl p-12 md:p-16 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Join Our Growing Team
              </h2>
              <p className="text-lg opacity-95 mb-6 font-light">
                We're expanding and looking for passionate individuals to join
                KOB as riders, field agents, and partners.
              </p>
              <p className="text-lg opacity-90 font-light">
                Whether you're looking for flexible work opportunities or want
                to be part of a revolutionary marketplace, we'd love to hear
                from you.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <div className="bg-white bg-opacity-15 backdrop-blur-sm p-7 rounded-xl border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300">
                <h3 className="text-2xl font-bold mb-3">
                  🏍️ Riders & Delivery Partners
                </h3>
                <p className="text-base opacity-90 mb-5">
                  Help deliver orders across Katsina and surrounding areas
                </p>
                <a
                  href={t("seller.forms.rider_agent")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-white text-kob-primary font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Apply Now →
                </a>
              </div>
              <div className="bg-white bg-opacity-15 backdrop-blur-sm p-7 rounded-xl border border-white border-opacity-20 hover:bg-opacity-25 transition-all duration-300">
                <h3 className="text-2xl font-bold mb-3">🚀 Field Agents</h3>
                <p className="text-base opacity-90 mb-5">
                  Support sellers and expand KOB's presence locally
                </p>
                <a
                  href={t("seller.forms.rider_agent")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-white text-kob-primary font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Apply Now →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
