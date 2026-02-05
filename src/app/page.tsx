'use client';

import { useLenis } from "@/hooks/useLenis";

export default function Home() {
  useLenis();

  return (
    <div>
      <section className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 flex items-center justify-center p-5">
        <div className="max-w-md p-8 text-center bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Portfolio 2.0
          </h1>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Welcome to my portfolio with beautiful liquid glass effects and smooth scrolling!
          </p>
          <button 
            className="px-6 py-3 text-base bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 text-white hover:bg-white/30 transition-all"
            onClick={() => {
              const aboutSection = document.getElementById('about');
              if (aboutSection) {
                aboutSection.scrollIntoView();
              }
            }}
          >
            Explore My Work
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-red-500 flex items-center justify-center p-5">
        <div className="max-w-2xl p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">
            About Me
          </h2>
          <p className="text-white/90 text-lg mb-6 leading-relaxed">
            I'm a passionate developer who loves creating beautiful, interactive web experiences. 
            This portfolio showcases the power of modern web technologies including React, 
            Tailwind CSS, liquid glass effects, and smooth scrolling.
          </p>
          <p className="text-white/90 text-lg leading-relaxed">
            The combination of glassmorphism design and buttery smooth scrolling creates 
            an immersive user experience that feels both modern and elegant.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center p-5">
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl font-bold text-white mb-12 text-center drop-shadow-lg">
            My Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Project One</h3>
              <p className="text-white/90 mb-4">
                A beautiful web application built with React and modern design principles.
              </p>
              <button className="px-4 py-2 text-sm bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 text-white hover:bg-white/30 transition-all">
                View Project
              </button>
            </div>
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Project Two</h3>
              <p className="text-white/90 mb-4">
                An innovative solution combining cutting-edge technology with user-centered design.
              </p>
              <button className="px-4 py-2 text-sm bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 text-white hover:bg-white/30 transition-all">
                View Project
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="min-h-screen bg-gradient-to-br from-yellow-500 via-green-500 to-blue-500 flex items-center justify-center p-5">
        <div className="max-w-md p-8 text-center bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
            Get In Touch
          </h2>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Ready to work together? Let's create something amazing!
          </p>
          <button className="px-6 py-3 text-base bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 text-white hover:bg-white/30 transition-all">
            Contact Me
          </button>
        </div>
      </section>
    </div>
  );
}