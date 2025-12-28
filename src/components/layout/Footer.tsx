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
              Technical Delivery Manager delivering enterprise software with strong full-stack capabilities, modern architecture, and cross-functional leadership.
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/kuhandran-samudrapandiyan/" target="_blank" rel="noopener noreferrer" 
                 className="text-slate-400 hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com/kuhandran" target="_blank" rel="noopener noreferrer"
                 className="text-slate-400 hover:text-blue-400 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'About', id: 'about' },
                { label: 'Skills', id: 'skills' },
                { label: 'Experience', id: 'experience' },
                { label: 'Projects', id: 'projects' },
                { label: 'Contact', id: 'contact' }
              ].map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className="text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:skuhandran@yahoo.com" className="text-slate-400 hover:text-white transition-colors font-medium">
                  📧 Email me
                </a>
              </li>
              <li>
                <a href="tel:+60149337280" className="text-slate-400 hover:text-white transition-colors font-medium">
                  📞 Call me
                </a>
              </li>
              <li className="text-slate-400 pt-2 border-t border-slate-700">
                <p className="text-sm">📍 Based in Kuala Lumpur, Malaysia</p>
                <p className="text-sm mt-2">Open to remote and relocation opportunities</p>
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