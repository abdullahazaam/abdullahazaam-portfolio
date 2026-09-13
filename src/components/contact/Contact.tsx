import { SectionDepth } from './SectionDepth';
import React, { useState } from 'react';
import { Mail, Copy, Check, Send, Sparkles, MessageSquare, ArrowUpRight } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../common/Icons';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const emailAddress = 'abdullahazaam1505@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formValues = new FormData(form);
    const name = String(formValues.get('name') || formData.name).trim();
    const email = String(formValues.get('email') || formData.email).trim();
    const message = String(formValues.get('message') || formData.message).trim();
    if (!name || !email || !message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
      form.reset();
    }, 4000);
  };


  return (
    <section id="contact" className="contact-upgraded relative py-28 bg-[#030303] overflow-hidden border-t border-red-950/20">
      <SectionDepth />
      {/* Soft Red Ambient Glow from Corner */}
      <div className="absolute top-1/2 -left-20 w-[750px] h-[750px] bg-[#260000]/40 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-[#1A0000]/30 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
        <div className="contact-layout">
          {/* ===================================================
              LEFT SIDE: Heading & Contact Channels (5 Columns)
             =================================================== */}
          <div className="contact-intro">
            <div className="contact-heading">
            {/* Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0C0C0C] border border-red-900/40 text-[#E50914] text-xs font-mono tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GET IN TOUCH</span>
            </div>

            {/* Natural Sentence-Cased Headline */}
            <h2 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.05]">
              Let&apos;s build{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-[#FF4444]">
                something great.
              </span>
            </h2>

            {/* Short Supporting Text */}
            <p className="mt-5 font-sans text-sm sm:text-base text-neutral-300 max-w-md leading-relaxed font-normal">
              Open to internships, junior developer opportunities, collaborations and interesting projects.
            </p>

            </div>
            {/* Existing contact channels occupy the second reference column. */}
            <div className="contact-channels mt-8 w-full max-w-md space-y-3">
              {/* Email Card */}
              <div className="premium-card p-3.5 sm:p-4 rounded-2xl bg-[#090909]/95 border border-neutral-900/90 flex items-center justify-between gap-3 hover:border-red-900/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#141414] border border-red-950 flex items-center justify-center text-[#E50914] flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-sans text-[11px] text-neutral-400 block font-medium">Email</span>
                    <a
                      href={`mailto:${emailAddress}`}
                      className="font-sans text-xs sm:text-sm font-semibold text-white hover:text-[#E50914] transition-colors truncate max-w-[200px] sm:max-w-none block"
                    >
                      {emailAddress}
                    </a>
                  </div>
                </div>

                <button
                  onClick={copyEmail}
                  className="p-2 rounded-xl bg-[#141414] border border-neutral-800 text-neutral-400 hover:text-white hover:border-red-600/40 transition-all flex-shrink-0"
                  aria-label="Copy email address"
                  title="Copy email"
                >
                  {copied ? <Check className="w-4 h-4 text-[#E50914]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* LinkedIn Card */}
              <a
                href="https://linkedin.com/in/abdullah-azaam-76975440a"
                target="_blank"
                rel="noopener noreferrer"
                className="premium-card p-3.5 sm:p-4 rounded-2xl bg-[#090909]/95 border border-neutral-900/90 flex items-center justify-between gap-3 hover:border-red-900/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#141414] border border-red-950 flex items-center justify-center text-[#E50914] flex-shrink-0">
                    <LinkedinIcon size={18} />
                  </div>
                  <div>
                    <span className="font-sans text-[11px] text-neutral-400 block font-medium">LinkedIn</span>
                    <span className="font-sans text-xs sm:text-sm font-semibold text-white group-hover:text-[#E50914] transition-colors truncate max-w-[200px] sm:max-w-none block">
                      abdullah-azaam-76975440a
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </a>

              {/* GitHub Card */}
              <a
                href="https://github.com/abdullahazaam"
                target="_blank"
                rel="noopener noreferrer"
                className="premium-card p-3.5 sm:p-4 rounded-2xl bg-[#090909]/95 border border-neutral-900/90 flex items-center justify-between gap-3 hover:border-red-900/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#141414] border border-red-950 flex items-center justify-center text-[#E50914] flex-shrink-0">
                    <GithubIcon size={18} />
                  </div>
                  <div>
                    <span className="font-sans text-[11px] text-neutral-400 block font-medium">GitHub</span>
                    <span className="font-sans text-xs sm:text-sm font-semibold text-white group-hover:text-[#E50914] transition-colors truncate max-w-[200px] sm:max-w-none block">
                      github.com/abdullahazaam
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* ===================================================
              CENTER: Clean Contact Form (5 Columns)
             =================================================== */}
          <div className="contact-form">
            <div className="premium-card rounded-3xl bg-[#0A0A0A]/95 border border-neutral-900 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.85)]">
              {/* Top red glow accent */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent opacity-80" />

              <div className="flex items-center gap-2 text-[#E50914] mb-6">
                <MessageSquare className="w-4 h-4" />
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-300">
                  Send a Direct Message
                </span>
              </div>

              {formSubmitted ? (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-red-950/60 border border-[#E50914] flex items-center justify-center text-[#E50914] mb-4 shadow-[0_0_20px_rgba(229,9,20,0.4)]">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white">
                    Message Received
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-neutral-400 mt-2 max-w-xs">
                    Thank you for reaching out! Abdullah will reply to your message shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="sr-only">Your Name</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      autoComplete="name"
                      className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="sr-only">Your Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      autoComplete="email"
                      className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="sr-only">Your Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={4}
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-colors resize-none"
                    />
                  </div>


                  <button
                    type="submit"
                    className="group w-full py-3.5 rounded-xl bg-[#E50914] text-white font-sans font-semibold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(229,9,20,0.35)] hover:shadow-[0_0_30px_rgba(229,9,20,0.65)] hover:bg-[#ff1e2b] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ===================================================
              RIGHT SIDE: Neon Calligraphy Art (2 Columns on Desktop)
              Matching full-structure.png "Good Ideas Great Projects"
             =================================================== */}
          <div className="contact-quote hidden lg:flex flex-col items-center justify-center text-center relative py-6">
            <div className="relative">
              {/* Subtle Red Halo Behind Quote */}
              <div className="absolute inset-0 bg-[#E50914]/15 blur-2xl rounded-full pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center gap-1 select-none">
                <span className="font-serif italic text-2xl text-neutral-300 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                  Good
                </span>
                <span className="font-serif italic text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-[#E50914] drop-shadow-[0_0_15px_rgba(229,9,20,0.6)]">
                  Ideas
                </span>
                <span className="font-serif italic text-3xl font-bold text-[#E50914] drop-shadow-[0_0_20px_rgba(229,9,20,0.8)] mt-2">
                  Great
                </span>
                <span className="font-serif italic text-2xl text-neutral-200 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                  Projects
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
