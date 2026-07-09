import React from 'react';

const Article = ({ 
  title = "The Ethical Architecture of Synthetic Memory", 
  author = "Kim Robert Rampling",
  date = "APRIL 27, 2026",
  content = "As we transition from raw data ingestion to permanent cognitive pillars, the architecture of our digital archives must reflect the weight of the information they hold...",
  signalData = "ENCRYPTED_SIGNAL // SOURCE_VERIFIED // 0.94_CONFIDENCE"
}) => {
  return (
    // REVERTED BACKGROUND & COLOR: bg-[#1a1a1a] (charcoal) and text-white
    <article className="max-w-screen-xl mx-auto px-6 py-24 animate-in fade-in duration-1000 bg-[#1a1a1a] text-white selection:bg-investigation selection:text-white">
      {/* Investigation Metadata Header with white border */}
      <header className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20 border-b-4 border-white/20 pb-12">
        <div className="md:col-span-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-investigation text-white text-[10px] font-mono font-black px-2 py-1 tracking-widest">
              OFFICIAL_RELEASE
            </span>
            <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase">FILE_ID: {Math.random().toString(36).toUpperCase().substring(7)}</span>
          </div>

          {/* Heading is now white */}
          <h1 className="font-fraunces text-4xl md:text-7xl font-black leading-[0.95] text-white tracking-tighter mb-10">
            {title}
          </h1>
          
          {/* Metadata is now white/gray */}
          <div className="flex items-center gap-8 font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white flex items-center justify-center text-black text-[10px] font-black">KRR</div>
              <span>INVESTIGATION BY {author}</span>
            </div>
            <span className="text-gray-600">/</span>
            <span>{date}</span>
          </div>
        </div>
      </header>

      {/* Primary Report Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* The "Intel Sidebar" with subtle dark contrast */}
        <aside className="lg:col-span-4 order-2 lg:order-1">
          {/* Updated bg and border for charcoal theme */}
          <div className="sticky top-32 bg-black p-10 border-l-4 border-investigation">
            <span className="font-mono text-[10px] tracking-[0.3em] text-investigation font-black uppercase block mb-6">
              Source Signal
            </span>
            {/* Intel Quote now white/italic */}
            <p className="font-fraunces text-lg text-white leading-tight italic mb-8">
              "{signalData}"
            </p>
            <div className="h-[1px] bg-white/10 w-full mb-8"></div>
            {/* Metadata in sidebar muted */}
            <p className="font-mono text-[9px] text-gray-500 tracking-[0.2em] leading-relaxed">
              ORIGIN: FIELD_ANALYSIS <br />
              INTEGRITY: HIGH_CONFIDENCE <br />
              ACCESS_LEVEL: UNRESTRICTED
            </p>
          </div>
        </aside>

        {/* The Findings (Body Text) */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          {/* Body text updated for dark theme */}
          <div className="font-manrope text-[1.15rem] md:text-[1.25rem] leading-[1.8] text-gray-300 space-y-10">
            {/* Lead paragraph in white */}
            <p className="font-fraunces font-bold text-2xl text-white leading-snug">
              {content}
            </p>
            
            <p>
              In this phase, we move beyond the ephemeral. The "Double Take" is not just about a visual glitch; 
              it is about the cognitive pause required to understand the shift from experimental research 
              to foundational truth.
            </p>

            {/* Blockquote in white */}
            <blockquote className="py-12 font-fraunces text-3xl font-black italic text-white border-y-2 border-white/10 my-16 px-4">
              "The archive is not a graveyard of data, but a cathedral of verified intelligence."
            </blockquote>

            <p>
              By utilizing the high-contrast layouts and sharp typography, we force the reader’s eye to move 
              with intention, mimicking the analytical process of the investigator itself.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
};

export default Article;