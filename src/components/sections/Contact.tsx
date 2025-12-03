'use client';
import { useState } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { Button } from '../elements/Button';
import { Card } from '../elements/Card';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 1000);
  };
  
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-900 to-blue-900">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle="Get In Touch"
          title="Let's Work Together"
          description="Open to new opportunities and collaborations"
        />
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Send Me a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Project Inquiry"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
                
                {submitStatus === 'success' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700">
                    Message sent successfully! I&apos;ll get back to you soon.
                  </div>
                )}
              </form>
            </Card>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
              <p className="text-slate-300 mb-8">
                Feel free to reach out through any of these channels. I&apos;m always open to 
                discussing new projects, opportunities, or collaborations.
              </p>
              
              <div className="space-y-4">
                <a 
                  href="mailto:skuhandran@yahoo.com"
                  className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-slate-300">skuhandran@yahoo.com</div>
                  </div>
                </a>
                
                <a 
                  href="tel:+60149337280"
                  className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Phone size={24} />
                  </div>
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-slate-300">+60 14 933 7280</div>
                  </div>
                </a>
                
                <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div className="font-semibold">Location</div>
                    <div className="text-slate-300">Kuala Lumpur, Malaysia</div>
                  </div>
                </div>
                
                <a 
                  href="https://linkedin.com/in/kuhandran-samudrapandiyan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Linkedin size={24} />
                  </div>
                  <div>
                    <div className="font-semibold">LinkedIn</div>
                    <div className="text-slate-300">Connect with me</div>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Availability Badge */}
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="font-semibold text-lg">Available for Opportunities</span>
              </div>
              <p className="text-slate-300 text-sm">
                Open to full-time positions, consulting, and relocation opportunities globally.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};