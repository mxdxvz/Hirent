import React from "react";
import Navbar from "../components/layouts/Navbar";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-[55px]">
        {/* Hero Section */}
        <section className="relative h-[400px] bg-gradient-to-br from-purple-900 to-purple-700 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200')",
            }}
          />
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 lg:px-24 h-full flex flex-col justify-center">
            <div className="text-white max-w-2xl">
              <p className="text-sm font-semibold tracking-wide uppercase mb-4">ABOUT US</p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                We make renting simple, smart, and sustainable
              </h1>
            </div>
          </div>
        </section>

        {/* Mission Statement Section */}
        <section className="bg-purple-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
            <div className="max-w-4xl space-y-6">
              <p className="text-base leading-relaxed">
                We believe progress starts with access. By transforming how people rent and share, we're not just simplifying transactions; 
                we're reimagining ownership itself.
              </p>
              <p className="text-base leading-relaxed">
                At Hirent, we connect communities through technology, empowering everyone to save time, money, and resources. We partner 
                with renters, owners, and innovators who share our mission to make sustainable living the new standard.
              </p>
              <p className="text-base leading-relaxed">
                Together, we're building a connected future where sharing is second nature and sustainability is effortless.
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Who we are</h2>
                <p className="text-gray-700 leading-relaxed">
                  We are a collective of visionaries, and problem-solvers dedicated to creating a smarter way to share and rent. 
                  Bound by common values and a shared vision, we work together to make access equitable and sustainability achievable for everyone.
                </p>
              </div>

              <div className="relative h-[350px] rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Grid Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Our people & leadership</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We are defined by collaboration, innovation, and trust, creating a platform built by people for people.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Purpose, mission & values</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We value affordability, accessibility, and sustainability, shaping a sharing economy that benefits everyone.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Our aspiration</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  To empower users to save money, reduce waste, and create new income opportunities through smart renting.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Our governance</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We are committed to transparency, fairness, and ethical practices in every rental and partnership.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Work Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800"
                  alt="Team working together"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-8">How we work</h2>
                <p className="text-gray-700 leading-relaxed mb-8">
                  From individuals to businesses, we partner with our users to help them find, rent, and manage what they need, 
                  all while fostering trust, safety, and convenience.
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">From idea to impact</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      We turn ideas into action, building smarter, faster, and more secure rental experiences for everyone.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Innovation & technology</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Our platform uses modern tools to ensure real-time availability, secure payments, and seamless experiences.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Client Capabilities Network</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      We empower users with data-driven insights and smart tools to manage rentals efficiently.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Case studies</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Every successful rental is proof that sharing can be both practical and powerful.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Commitments Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-8">Our commitments</h2>
                <p className="text-gray-700 leading-relaxed mb-8">
                  We are dedicated to promoting a responsible rental culture that benefits people, communities, and the planet.
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Our diverse meritocracy</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      We believe in equal opportunity and inclusivity, empowering everyone to contribute and thrive.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Social Responsibility</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      We invest in communities through meaningful collaborations, supporting programs that create real, long-term change.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">Environmental sustainability</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      We work toward reducing waste and carbon footprint across every rental.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">2025 Sustainable Growth</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      We're building toward a future where smart renting means a cleaner, greener, and more inclusive world.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"
                  alt="Team commitment"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
