// ============================================
// FILE: src/components/sections/Contact.tsx
// ============================================

'use client';
import { useState, useEffect } from 'react';
import { SectionHeader } from '../elements/SectionHeader';
import { Button } from '../elements/Button';
import { Card } from '../elements/Card';
import { Mail, Phone, MapPin, Linkedin, Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { getStaticContentLabels } from '../../lib/data/contentLabels';
import { fetchApiConfig } from '@/lib/config/configLoader';
import { getErrorMessageSync } from '@/lib/config/appConfig';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const Contact = () => {
  const [contentLabels, setContentLabels] = useState(getStaticContentLabels());
  const [apiConfig, setApiConfig] = useState<any>({});
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  useEffect(() => {
    // Fetch content labels and API config from CDN
    const labels = getStaticContentLabels();
    if (labels && Object.keys(labels).length > 0) {
      setContentLabels(labels);
    }
    fetchApiConfig().then(config => setApiConfig(config));
  }, []);
  
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
      setErrorMessage(contentLabels?.contact?.form?.fileUpload?.invalidType || getErrorMessageSync('contact.file.invalidType', 'Invalid file type'));
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
      setErrorMessage(contentLabels?.contact?.form?.fileUpload?.invalidSize || getErrorMessageSync('contact.file.invalidSize', 'File size exceeds 5MB'));
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
      const response = await fetch(apiConfig.fullUrls.contact, {
        method: 'POST',
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || getErrorMessageSync('contact.submission.failed', 'Failed to send message'));
      }
      
      setIsSubmitting(false);
      setSubmitStatus('success');
      
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      setAttachedFile(null);
      
      setTimeout(() => setSubmitStatus('idle'), 5000);
      
    } catch (error) {
      console.error(getErrorMessageSync('contact.submission.failedWithDetails', 'Form submission error:'), error);
      setIsSubmitting(false);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : getErrorMessageSync('contact.submission.failedWithDetails', 'Failed to send message. Please try again.'));
      
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
    <section id="contact" className="py-20 bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          subtitle={contentLabels?.contact?.subtitle || ''}
          title={contentLabels?.contact?.title || 'Get In Touch'}
          description={contentLabels?.contact?.description || ''}
        />
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mt-12">
          {/* Contact Form - 2 columns */}
          <div className="md:col-span-2">
            <Card className="p-8 md:p-10 bg-white border-2 border-slate-100">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-slate-900 mb-2">{contentLabels?.contact?.form?.heading || 'Send Me a Message'}</h3>
                <p className="text-slate-600">Fill out the form below and I'll get back to you within 24 hours.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-3">
                      {contentLabels?.contact?.form?.labels?.name || 'Name'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50 hover:bg-white text-slate-900 placeholder-slate-400"
                      placeholder={contentLabels?.contact?.form?.placeholders?.name || 'Your name'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-3">
                      {contentLabels?.contact?.form?.labels?.email || 'Email'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50 hover:bg-white text-slate-900 placeholder-slate-400"
                      placeholder={contentLabels?.contact?.form?.placeholders?.email || 'Your email'}
                    />
                  </div>
                </div>
                
                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">
                    {contentLabels?.contact?.form?.labels?.subject || 'Subject'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50 hover:bg-white text-slate-900 placeholder-slate-400"
                    placeholder={contentLabels?.contact?.form?.placeholders?.subject || 'Subject'}
                  />
                </div>
                
                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">
                    {contentLabels?.contact?.form?.labels?.message || 'Message'} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none bg-slate-50 hover:bg-white text-slate-900 placeholder-slate-400"
                    placeholder={contentLabels?.contact?.form?.placeholders?.message || 'Your message'}
                  />
                </div>
                
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">
                    {contentLabels?.contact?.form?.labels?.file || 'Attachment'}
                  </label>
                  <div className="space-y-3">
                    <label 
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center gap-3 w-full px-6 py-8 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer transition-all group"
                    >
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      <div className="text-center">
                        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 block">
                          {contentLabels?.contact?.form?.fileUpload?.text || 'Click to upload'}
                        </span>
                        <span className="text-xs text-slate-500 mt-1 block">Max 5MB (PDF, DOCX)</span>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    
                    {/* Attached File Display */}
                    {attachedFile && (
                      <div className="flex items-center justify-between p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{attachedFile.name}</p>
                            <p className="text-xs text-slate-500">{formatFileSize(attachedFile.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                          aria-label={contentLabels?.contact?.form?.fileUpload?.removeButton || 'Remove file'}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full h-12 text-base font-semibold rounded-xl"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? contentLabels?.contact?.form?.buttons?.submitting || 'Sending...' : contentLabels?.contact?.form?.buttons?.submit || 'Send Message'}
                </Button>
                
                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-emerald-900 font-semibold">{contentLabels?.contact?.form?.messages?.successTitle || 'Success!'}</p>
                      <p className="text-emerald-700 text-sm mt-1">
                        {contentLabels?.contact?.form?.messages?.successDescription || 'Message sent successfully'}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-900 font-semibold">{contentLabels?.contact?.form?.messages?.errorTitle || 'Error'}</p>
                      <p className="text-red-700 text-sm mt-1">
                        {errorMessage || contentLabels?.contact?.form?.messages?.errorDescription || 'Something went wrong'}
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </Card>
          </div>
          
          {/* Contact Information - 1 column */}
          <div className="space-y-6">
            {/* Contact Info Card */}
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{contentLabels?.contact?.contactInfo?.heading || 'Contact Information'}</h3>
              <p className="text-slate-600 text-sm mb-6">
                {contentLabels?.contact?.contactInfo?.description || ''}
              </p>
              
              <div className="space-y-4">
                {/* Email */}
                <a 
                  href={`mailto:${contentLabels?.contact?.contactInfo?.email?.value || 'skuhandran@yahoo.com'}`}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{contentLabels?.contact?.contactInfo?.email?.label || 'Email'}</div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{contentLabels?.contact?.contactInfo?.email?.value || 'skuhandran@yahoo.com'}</div>
                  </div>
                </a>
                
                {/* Phone */}
                <a 
                  href={`tel:${(contentLabels?.contact?.contactInfo?.phone?.value || '').replace(/\s+/g, '')}`}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{contentLabels?.contact?.contactInfo?.phone?.label || 'Phone'}</div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{contentLabels?.contact?.contactInfo?.phone?.value || '+60149337280'}</div>
                  </div>
                </a>
                
                {/* Location */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{contentLabels?.contact?.contactInfo?.location?.label || 'Location'}</div>
                    <div className="text-sm font-semibold text-slate-900">{contentLabels?.contact?.contactInfo?.location?.value || 'Kuala Lumpur, Malaysia'}</div>
                  </div>
                </div>
                
                {/* LinkedIn */}
                <a 
                  href="https://linkedin.com/in/kuhandran-samudrapandiyan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Linkedin size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{contentLabels?.contact?.contactInfo?.linkedin?.label || 'LinkedIn'}</div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{contentLabels?.contact?.contactInfo?.linkedin?.value || 'Connect on LinkedIn'}</div>
                  </div>
                </a>
              </div>
            </Card>
            
            {/* Availability Badge */}
            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse mt-1 flex-shrink-0"></div>
                <div>
                  <span className="font-bold text-slate-900 block text-lg">{contentLabels?.contact?.availability?.title || 'Available for Work'}</span>
                  <p className="text-slate-700 text-sm mt-2">
                    {contentLabels?.contact?.availability?.description || 'Open to new opportunities'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};