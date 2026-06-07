import React, { useEffect, useRef, useState } from 'react';
import { CarIcon } from './icons/CarIcon';
import { WrenchScrewdriverIcon } from './icons/WrenchScrewdriverIcon';
import { PhotoIcon } from './icons/PhotoIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { StarIcon } from './icons/StarIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { UsersIcon } from './icons/UsersIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChatBubbleBottomCenterTextIcon } from './icons/ChatBubbleBottomCenterTextIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { AboutPage } from './AboutPage';


const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} className="text-slate-300 hover:text-white transition-colors duration-300 font-medium text-sm">
        {children}
    </a>
);

const Header: React.FC<{ onLoginClick: () => void; onAboutClick: () => void }> = ({ onLoginClick, onAboutClick }) => (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="#" className="flex items-center gap-2 text-white text-xl font-bold">
                <CarIcon className="w-8 h-8 text-violet-400" />
                <span>AutoFix AI</span>
            </a>
            <nav className="hidden md:flex items-center gap-8">
                <button onClick={onAboutClick} className="text-slate-300 hover:text-white transition-colors duration-300 font-medium cursor-pointer text-sm">
                    About
                </button>
                <NavLink href="#services">Services</NavLink>
                <NavLink href="#how-it-works">How It Works</NavLink>
                <NavLink href="#testimonials">Testimonials</NavLink>
            </nav>
            <button
                onClick={onLoginClick}
                className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold px-5 py-2 rounded-lg hover:from-violet-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-violet-500/30"
            >
                Login or Signup
            </button>
        </div>
    </header>
);

const ServiceCard: React.FC<{ icon: React.FC<any>; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 text-center flex flex-col items-center reveal">
        <div className="h-16 w-16 mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
            <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{children}</p>
    </div>
);

const StepCard: React.FC<{ number: string; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="relative pl-12 reveal">
        <div className="absolute left-0 top-0 h-10 w-10 flex items-center justify-center text-violet-400 font-bold text-3xl border-2 border-slate-700 rounded-full bg-slate-800">
            {number}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400">{children}</p>
    </div>
);

const Feature: React.FC<{ icon: React.FC<any>; children: React.ReactNode }> = ({ icon: Icon, children }) => (
    <li className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-violet-400 flex-shrink-0" />
        <span className="text-slate-300">{children}</span>
    </li>
);

const TestimonialCard: React.FC<{ name: string; text: string; image: string; rating: number }> = ({ name, text, image, rating }) => (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 reveal">
        <div className="flex items-center mb-4">
            <img src={image} alt={name} className="h-12 w-12 rounded-full object-cover" />
            <div className="ml-4">
                <h4 className="font-bold text-white">{name}</h4>
                <div className="flex items-center">
                    {[...Array(rating)].map((_, i) => (
                        <StarIcon key={i} className="w-5 h-5 text-amber-400" />
                    ))}
                </div>
            </div>
        </div>
        <p className="text-slate-400 italic">"{text}"</p>
    </div>
);

export const LandingPage: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => {
    const [showAbout, setShowAbout] = useState(false);

    useEffect(() => {
        const revealElements = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
        return () => revealElements.forEach(el => observer.unobserve(el));
    }, []);

    if (showAbout) {
        return <AboutPage onBack={() => setShowAbout(false)} />;
    }

    return (
        <div className="bg-slate-900 text-white font-sans">
            <Header onLoginClick={onLoginClick} onAboutClick={() => setShowAbout(true)} />

            <main>
                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549927681-0b5791572974?q=80&w=2940&auto=format&fit=crop')", animation: 'pan 20s infinite alternate linear' }}></div>
                    <div className="absolute inset-0 bg-black/70 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>

                    <div className="relative z-20 p-6">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-violet-300">
                            Perfection in Every Detail.
                        </h1>
                        <p className="mt-4 text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
                            Your vehicle, reimagined. We combine cutting-edge AI technology with master craftsmanship to restore your car to its former glory.
                        </p>
                        <button
                            onClick={onLoginClick}
                            className="mt-10 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-10 py-4 rounded-full text-lg shadow-2xl shadow-violet-800/20 ring-2 ring-white/10 hover:scale-105 transition-transform"
                        >
                            Get an Instant Estimate
                        </button>
                    </div>
                     <style>{`@keyframes pan { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }`}</style>
                </section>

                {/* Services Section */}
                <section id="services" className="py-20 md:py-32 bg-slate-900">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16 reveal">
                            <h2 className="text-4xl md:text-5xl font-bold text-white">Our Premier Services</h2>
                            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">From minor dings to major collisions, we handle it all with precision and care.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <ServiceCard icon={WrenchScrewdriverIcon} title="Collision Repair">
                                Comprehensive repairs that restore your vehicle's safety and performance to pre-accident condition.
                            </ServiceCard>
                            <ServiceCard icon={SparklesIcon} title="Expert Auto Painting">
                                Using state-of-the-art color matching technology for a flawless, factory-quality finish.
                            </ServiceCard>
                            <ServiceCard icon={CarIcon} title="Paintless Dent Removal">
                                An efficient and affordable way to remove minor dents and dings without affecting the original paint.
                            </ServiceCard>
                            <ServiceCard icon={ShieldCheckIcon} title="Detailing & Restoration">
                                Meticulous interior and exterior detailing to bring back that showroom shine and protect your investment.
                            </ServiceCard>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 md:py-32 bg-black/20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16 reveal">
                            <h2 className="text-4xl md:text-5xl font-bold text-white">A Seamless Repair Experience</h2>
                            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">Get back on the road in just three simple steps.</p>
                        </div>
                        <div className="max-w-3xl mx-auto grid gap-12">
                            <StepCard number="1" title="Upload & Analyze">
                                Snap a few photos of the damage and upload them. Our AI provides an instant, accurate estimate in seconds.
                            </StepCard>
                            <StepCard number="2" title="Book with Confidence">
                                Choose a certified local shop, review your quote, and book a service appointment that fits your schedule.
                            </StepCard>
                            <StepCard number="3" title="Drive Away Happy">
                                Our expert technicians will restore your car to perfection. We'll notify you when it's ready for pickup.
                            </StepCard>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-20 md:py-32 bg-slate-900">
                     <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                        <div className="reveal">
                            <img src="https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=2787&auto=format&fit=crop" alt="Technician working on a car" className="rounded-2xl shadow-2xl shadow-slate-950"/>
                        </div>
                        <div className="reveal">
                            <h2 className="text-4xl md:text-5xl font-bold text-white">Quality You Can Trust. <br/> Service You'll Remember.</h2>
                            <p className="mt-6 text-lg text-slate-400">
                                We are committed to providing the highest quality repairs and an unmatched customer experience. Your satisfaction is our guarantee.
                            </p>
                            <ul className="mt-8 space-y-4">
                               <Feature icon={CheckIcon}>ASE Certified Technicians</Feature>
                               <Feature icon={ShieldCheckIcon}>Lifetime Warranty on All Repairs</Feature>
                               <Feature icon={UsersIcon}>Transparent Pricing & AI-Powered Estimates</Feature>
                               <Feature icon={SparklesIcon}>OEM Parts and Materials</Feature>
                            </ul>
                        </div>
                     </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-20 md:py-32 bg-black/20">
                     <div className="container mx-auto px-6">
                         <div className="text-center mb-16 reveal">
                            <ChatBubbleBottomCenterTextIcon className="h-12 w-12 mx-auto text-violet-400" />
                            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">Loved by Drivers Everywhere</h2>
                            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">See what our satisfied customers have to say about their experience.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <TestimonialCard 
                                name="Sarah J." 
                                text="The AI estimate was spot on and so convenient! The repair itself was flawless. My car looks better than it did before the accident."
                                image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop"
                                rating={5}
                            />
                             <TestimonialCard 
                                name="Mike R." 
                                text="I was dreading the repair process, but AutoFix AI made it incredibly simple. The communication from the shop was excellent. Highly recommend."
                                image="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=250&auto=format&fit=crop"
                                rating={5}
                            />
                             <TestimonialCard 
                                name="Emily C." 
                                text="Absolutely top-notch service. The quality of the paint job is incredible, and the lifetime warranty gives me peace of mind."
                                image="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop"
                                rating={5}
                            />
                        </div>
                     </div>
                </section>

                {/* CTA Section */}
                <section className="relative py-20 md:py-32 bg-slate-800">
                     <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1617083294399-5339e3c55e07?q=80&w=2940&auto=format&fit=crop')", opacity: 0.1}}></div>
                     <div className="relative container mx-auto px-6 text-center reveal">
                        <h2 className="text-4xl md:text-5xl font-bold text-white">Ready for a Flawless Finish?</h2>
                        <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">Don't let damage diminish your drive. Get a free, no-obligation AI estimate today and see how easy auto repair can be.</p>
                        <button
                            onClick={onLoginClick}
                            className="mt-10 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-10 py-4 rounded-full text-lg shadow-2xl shadow-violet-800/20 ring-2 ring-white/10 hover:scale-105 transition-transform inline-flex items-center gap-2"
                        >
                            Start Your Free Estimate
                            <ArrowRightIcon className="w-5 h-5"/>
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
                <div className="container mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-slate-900">
                    
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white text-lg font-bold">
                            <CarIcon className="w-6 h-6 text-violet-400" />
                            <span>AutoFix AI</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-[11px]">
                            Next-generation AI-powered estimate flow, service dispatching, dynamic parts inventory tracking, and complete administrative overview.
                        </p>
                        <div className="pt-2 flex flex-col gap-1.5">
                            <button onClick={() => setShowAbout(true)} className="text-left font-semibold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer text-xs">
                                🎯 Learn more on our About page &rarr;
                            </button>
                            <div className="font-mono text-[10px] text-slate-500">
                                Version 2.4.0 (Enterprise Suite)
                            </div>
                        </div>
                    </div>

                    {/* Customer Portal Map */}
                    <div className="space-y-3">
                        <h4 className="text-white text-xs font-mono font-bold uppercase tracking-wider">
                            Customer Portal
                        </h4>
                        <ul className="space-y-2 text-[11px] font-medium">
                            <li>
                                <button onClick={onLoginClick} className="hover:text-violet-400 transition flex items-center gap-1.5 text-left">
                                    <span>📸</span> Instant AI Damage Estimator
                                </button>
                            </li>
                            <li>
                                <button onClick={onLoginClick} className="hover:text-violet-400 transition flex items-center gap-1.5 text-left">
                                    <span>🗺️</span> Shop Locator & Map Search
                                </button>
                            </li>
                            <li>
                                <button onClick={onLoginClick} className="hover:text-violet-400 transition flex items-center gap-1.5 text-left">
                                    <span>📅</span> Live Repair Tracker & Photos
                                </button>
                            </li>
                            <li>
                                <button onClick={onLoginClick} className="hover:text-violet-400 transition flex items-center gap-1.5 text-left">
                                    <span>💬</span> Customer Support Helpdesk
                                </button>
                            </li>
                            <li>
                                <button onClick={onLoginClick} className="hover:text-violet-400 transition flex items-center gap-1.5 text-left">
                                    <span>🔔</span> Notifications & Status Alerts
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Shop Management Map */}
                    <div className="space-y-3">
                        <h4 className="text-white text-xs font-mono font-bold uppercase tracking-wider">
                            Shop Management
                        </h4>
                        <ul className="space-y-2 text-[11px] font-medium">
                            <li>
                                <button onClick={onLoginClick} className="hover:text-violet-400 transition flex items-center gap-1.5 text-left">
                                    <span>📊</span> Real-Time Repair Workflow
                                </button>
                            </li>
                            <li>
                                <button onClick={onLoginClick} className="hover:text-violet-400 transition flex items-center gap-1.5 text-left">
                                    <span>🗓️</span> Shop & Technician Calendar
                                </button>
                            </li>
                            <li>
                                <button onClick={onLoginClick} className="hover:text-violet-400 transition flex items-center gap-1.5 text-left">
                                    <span>👥</span> Staff Directory & Payroll
                                </button>
                            </li>
                            <li>
                                <button onClick={onLoginClick} className="hover:text-violet-400 transition flex items-center gap-1.5 text-left">
                                    <span>⚙️</span> Services Catalog & Rates
                                </button>
                            </li>
                            <li>
                                <button onClick={onLoginClick} className="hover:text-violet-400 transition flex items-center gap-1.5 text-left">
                                    <span>📦</span> Parts & Inventory Ledger
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Admin Oversight Map */}
                    <div className="space-y-3">
                        <h4 className="text-white text-xs font-mono font-bold uppercase tracking-wider">
                            SaaS Administration
                        </h4>
                        <ul className="space-y-2 text-[11px] font-medium">
                            <li>
                                <button onClick={onLoginClick} className="hover:text-violet-400 transition flex items-center gap-1.5 text-left">
                                    <span>📈</span> Platform-Wide Analytics
                                </button>
                            </li>
                            <li>
                                <button onClick={onLoginClick} className="hover:text-violet-400 transition flex items-center gap-1.5 text-left">
                                    <span>🏬</span> Shop Verification & Auditing
                                </button>
                            </li>
                            <li>
                                <button onClick={onLoginClick} className="hover:text-violet-400 transition flex items-center gap-1.5 text-left">
                                    <span>👤</span> Global User Management
                                </button>
                            </li>
                            <li>
                                <button onClick={onLoginClick} className="hover:text-violet-400 transition flex items-center gap-1.5 text-left">
                                    <span>💳</span> Transaction History & Ledger
                                </button>
                            </li>
                            <li>
                                <button onClick={onLoginClick} className="hover:text-violet-400 transition flex items-center gap-1.5 text-left">
                                    <span>💬</span> Global Support Ticketing
                                </button>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500">
                    <p>&copy; {new Date().getFullYear()} AutoFix AI. All Rights Reserved.</p>
                    <div className="flex gap-6 items-center">
                        <button onClick={() => setShowAbout(true)} className="hover:text-slate-350 transition cursor-pointer text-xs font-medium">About System</button>
                        <a href="#" className="hover:text-slate-300 transition">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-300 transition">Terms of Service</a>
                        <a href="#" className="hover:text-slate-300 transition">Developer APIs</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
