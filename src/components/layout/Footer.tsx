import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              KS<span className="text-blue-400">.</span>
            </h3>
            <p className="text-slate-400 mb-4">
              Technical Delivery Manager specializing in enterprise applications and full-stack development.
            </p>
            <div className="flex gap-4">
              <a href="https://linkedin.com/in/kuhandran-samudrapandiyan" target="_blank" rel="noopener noreferrer" 
                 className="text-slate-400 hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                 className="text-slate-400 hover:text-blue-400 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['About', 'Skills', 'Experience', 'Projects', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-slate-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400">
                <Mail size={16} />
                <a href="mailto:skuhandran@yahoo.com" className="hover:text-white transition-colors">
                  skuhandran@yahoo.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone size={16} />
                <a href="tel:+60149337280" className="hover:text-white transition-colors">
                  +60 14 933 7280
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <MapPin size={16} />
                <span>Kuala Lumpur, Malaysia</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {currentYear} Kuhandran SamudraPandiyan. All rights reserved.
            </p>
            <p className="text-slate-400 text-sm">
              Built with Next.js & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};