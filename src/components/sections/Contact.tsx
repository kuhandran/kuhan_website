// ============================================
// FILE: src/components/sections/Contact.tsx
// ============================================

'use client';
import { useState } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { Button } from '../elements/Button';
import { Card } from '../elements/Card';
import { Mail, Phone, MapPin, Linkedin, Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !['pdf', 'docx'].includes(fileExtension || '')) {
      setErrorMessage('Only PDF and DOCX files are allowed');
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 3000);
      e.target.value = ''; // Reset input
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size must be less than 5MB');
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 3000);
      e.target.value = '';
      return;
    }
    
    setAttachedFile(file);
  };
  
  const removeFile = () => {
    setAttachedFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      
      if (attachedFile) {
        formDataToSend.append('file', attachedFile);
      }
      
      // Send to API Gateway backend
      const response = await fetch('https://api-gateway-services-7tgk.onrender.com/contact', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      setIsSubmitting(false);
      setSubmitStatus('success');
      
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      setAttachedFile(null);
      
      setTimeout(() => setSubmitStatus('idle'), 5000);
      
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
      
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                    placeholder="Project Inquiry"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none text-black"
                    placeholder="Tell me about your project..."
                  />
                </div>
                
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Attach File (Optional)
                  </label>
                  <div className="space-y-2">
                    <label 
                      htmlFor="file-upload"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors group"
                    >
                      <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      <span className="text-sm text-slate-600 group-hover:text-blue-600 transition-colors">
                        Click to upload PDF or DOCX (Max 5MB)
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-black"
                      />
                    </label>
                    
                    {/* Attached File Display */}
                    {attachedFile && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">{attachedFile.name}</p>
                            <p className="text-xs text-slate-500">{formatFileSize(attachedFile.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="p-1 hover:bg-blue-100 rounded transition-colors"
                          aria-label="Remove file"
                        >
                          <X className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
                
                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-emerald-700 font-medium">Message sent successfully!</p>
                      <p className="text-emerald-600 text-sm mt-1">
                        Thank you for reaching out. I&apos;ll get back to you soon.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-700 font-medium">Failed to send message</p>
                      <p className="text-red-600 text-sm mt-1">
                        {errorMessage || 'Please try again later or contact me directly via email.'}
                      </p>
                    </div>
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
                  href="mailto:kuhandransamudrapandiyan@gmail.com"
                  className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-slate-300">kuhandransamudrapandiyan@gmail.com</div>
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