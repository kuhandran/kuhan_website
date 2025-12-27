/**
 * Example Configuration Files for JSON-Driven Architecture
 * 
 * This document shows practical examples of how to configure
 * sections, forms, and elements using the new JSON-driven system
 */

// ============================================
// EXAMPLE 1: SIMPLE CONTACT FORM
// ============================================

const contactFormExample = {
  type: 'Contact',
  header: {
    subtitle: 'Get In Touch',
    title: 'Let\'s Connect',
    description: 'I\'d love to hear from you. Send me a message!'
  },
  elements: [
    {
      type: 'FormInput',
      inputType: 'text',
      name: 'fullName',
      label: 'Full Name',
      placeholder: 'John Doe',
      required: true,
      errorMessage: 'Please enter your full name'
    },
    {
      type: 'FormInput',
      inputType: 'email',
      name: 'email',
      label: 'Email Address',
      placeholder: 'john@example.com',
      required: true,
      validation: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      errorMessage: 'Please enter a valid email address'
    },
    {
      type: 'FormSelect',
      inputType: 'select',
      name: 'subject',
      label: 'Subject',
      required: true,
      options: [
        { label: 'General Inquiry', value: 'general' },
        { label: 'Job Opportunity', value: 'job' },
        { label: 'Collaboration', value: 'collab' },
        { label: 'Other', value: 'other' }
      ]
    },
    {
      type: 'FormTextarea',
      inputType: 'textarea',
      name: 'message',
      label: 'Message',
      placeholder: 'Your message here...',
      required: true,
      errorMessage: 'Please enter your message'
    },
    {
      type: 'FormCheckbox',
      inputType: 'checkbox',
      name: 'terms',
      label: 'Agree to terms',
      required: true,
      options: [
        { label: 'I agree to the privacy policy', value: 'privacy' }
      ]
    },
    {
      type: 'FormButton',
      label: 'Send Message',
      variant: 'primary',
      size: 'lg',
      fullWidth: true,
      icon: '✉️'
    }
  ]
};

// ============================================
// EXAMPLE 2: SUBSCRIPTION FORM WITH RADIO
// ============================================

const subscriptionFormExample = {
  type: 'Newsletter',
  header: {
    title: 'Subscribe to Updates',
    description: 'Get the latest news and updates'
  },
  elements: [
    {
      type: 'FormInput',
      inputType: 'email',
      name: 'email',
      label: 'Email',
      placeholder: 'your@email.com',
      required: true
    },
    {
      type: 'FormRadio',
      inputType: 'radio',
      name: 'frequency',
      label: 'Subscription Frequency',
      options: [
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' }
      ]
    },
    {
      type: 'FormButton',
      label: 'Subscribe',
      variant: 'outline',
      fullWidth: true
    }
  ]
};

// ============================================
// EXAMPLE 3: ADVANCED FORM WITH FILE UPLOAD
// ============================================

const jobApplicationFormExample = {
  type: 'Application',
  header: {
    title: 'Apply Now',
    description: 'Submit your application for the open position'
  },
  elements: [
    {
      type: 'FormInput',
      inputType: 'text',
      name: 'firstName',
      label: 'First Name',
      required: true
    },
    {
      type: 'FormInput',
      inputType: 'text',
      name: 'lastName',
      label: 'Last Name',
      required: true
    },
    {
      type: 'FormInput',
      inputType: 'email',
      name: 'email',
      label: 'Email',
      required: true
    },
    {
      type: 'FormInput',
      inputType: 'tel',
      name: 'phone',
      label: 'Phone Number',
      placeholder: '+60149337280',
      required: true
    },
    {
      type: 'FormInput',
      inputType: 'url',
      name: 'portfolio',
      label: 'Portfolio URL',
      placeholder: 'https://yourportfolio.com',
      validation: '^https?://.*'
    },
    {
      type: 'FormSelect',
      inputType: 'select',
      name: 'position',
      label: 'Position Applying For',
      required: true,
      options: [
        { label: 'Frontend Engineer', value: 'frontend' },
        { label: 'Backend Engineer', value: 'backend' },
        { label: 'Full Stack Engineer', value: 'fullstack' },
        { label: 'Data Engineer', value: 'data' }
      ]
    },
    {
      type: 'FormInput',
      inputType: 'date',
      name: 'startDate',
      label: 'Available Start Date',
      required: true
    },
    {
      type: 'FormTextarea',
      inputType: 'textarea',
      name: 'coverLetter',
      label: 'Cover Letter',
      placeholder: 'Tell us why you\'re a great fit...',
      required: true
    },
    {
      type: 'FormInput',
      inputType: 'file',
      name: 'resume',
      label: 'Upload Resume (PDF)',
      required: true
    },
    {
      type: 'FormCheckbox',
      inputType: 'checkbox',
      name: 'skills',
      label: 'Skills',
      options: [
        { label: 'React', value: 'react' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'Node.js', value: 'nodejs' },
        { label: 'AWS', value: 'aws' },
        { label: 'Docker', value: 'docker' }
      ]
    },
    {
      type: 'FormButton',
      label: 'Submit Application',
      variant: 'primary',
      size: 'lg',
      fullWidth: true,
      icon: '📤'
    }
  ]
};

// ============================================
// EXAMPLE 4: SECTION WITH DATA RENDERING
// ============================================

const projectsSectionExample = {
  type: 'Projects',
  header: {
    subtitle: 'My Work',
    title: 'Featured Projects',
    description: 'Check out some of my recent projects'
  },
  layout: 'grid',
  gridCols: 'md:grid-cols-2 lg:grid-cols-3',
  data: [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with React and Node.js',
      image: '/projects/ecommerce.jpg',
      techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      metrics: '500+ Daily Users',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/user/project'
    },
    {
      title: 'Task Management App',
      description: 'Collaborative task management with real-time updates',
      image: '/projects/tasks.jpg',
      techStack: ['React', 'Firebase', 'Tailwind CSS'],
      metrics: '1000+ Monthly Users',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/user/project'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Real-time analytics dashboard with data visualization',
      image: '/projects/analytics.jpg',
      techStack: ['Next.js', 'Python', 'PostgreSQL', 'D3.js'],
      metrics: '50% Performance Gain',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/user/project'
    }
  ]
};

// ============================================
// EXAMPLE 5: EXPERIENCE SECTION
// ============================================

const experienceSectionExample = {
  type: 'Experience',
  header: {
    subtitle: 'Professional Journey',
    title: 'Experience',
    description: 'My career progression and roles'
  },
  layout: 'list',
  data: [
    {
      title: 'Technical Lead',
      company: 'Tech Company Inc',
      duration: '2023 - Present',
      location: 'San Francisco, CA',
      description: [
        'Led a team of 8 engineers',
        'Improved system performance by 40%',
        'Mentored junior developers'
      ],
      techStack: ['React', 'Node.js', 'AWS', 'Docker'],
      logo: '/logos/techcompany.jpg'
    },
    {
      title: 'Senior Developer',
      company: 'Web Solutions Ltd',
      duration: '2021 - 2023',
      location: 'New York, NY',
      description: [
        'Developed full-stack applications',
        'Architected microservices',
        'Implemented CI/CD pipelines'
      ],
      techStack: ['React', 'Node.js', 'TypeScript', 'Kubernetes'],
      logo: '/logos/websolutions.jpg'
    }
  ]
};

// ============================================
// EXAMPLE 6: SKILLS SECTION WITH DATA
// ============================================

const skillsSectionExample = {
  type: 'Skills',
  header: {
    subtitle: 'My Expertise',
    title: 'Skills & Proficiencies',
    description: 'Technologies and tools I work with'
  },
  layout: 'grid',
  gridCols: 'md:grid-cols-2 lg:grid-cols-3',
  data: [
    { name: 'React', level: 95, category: 'Frontend' },
    { name: 'TypeScript', level: 90, category: 'Languages' },
    { name: 'Node.js', level: 85, category: 'Backend' },
    { name: 'AWS', level: 80, category: 'DevOps' },
    { name: 'Docker', level: 85, category: 'DevOps' },
    { name: 'MongoDB', level: 80, category: 'Database' },
    { name: 'PostgreSQL', level: 85, category: 'Database' },
    { name: 'GraphQL', level: 80, category: 'API' },
    { name: 'REST APIs', level: 90, category: 'API' }
  ]
};

// ============================================
// EXAMPLE 7: EDUCATION SECTION
// ============================================

const educationSectionExample = {
  type: 'Education',
  header: {
    subtitle: 'My Education',
    title: 'Qualifications',
    description: 'Academic background and certifications'
  },
  layout: 'list',
  data: [
    {
      school: 'Tech University',
      degree: 'Master of Science',
      field: 'Computer Science',
      graduationDate: '2021',
      cgpa: '3.9/4.0',
      activities: ['Dean\'s List', 'Hackathon Winner', 'Teaching Assistant']
    },
    {
      school: 'State College',
      degree: 'Bachelor of Science',
      field: 'Software Engineering',
      graduationDate: '2019',
      cgpa: '3.8/4.0',
      activities: ['Merit Scholarship', 'Club President']
    }
  ]
};

// ============================================
// EXAMPLE 8: COMBINED PAGE CONFIGURATION
// ============================================

const fullPageConfigurationExample = {
  sections: [
    {
      type: 'Hero',
      id: 'hero',
      useLazyLoad: false // Load immediately
    },
    {
      ...projectsSectionExample,
      id: 'projects',
      useLazyLoad: true
    },
    {
      ...skillsSectionExample,
      id: 'skills',
      useLazyLoad: true
    },
    {
      ...experienceSectionExample,
      id: 'experience',
      useLazyLoad: true
    },
    {
      ...educationSectionExample,
      id: 'education',
      useLazyLoad: true
    },
    {
      ...contactFormExample,
      id: 'contact',
      useLazyLoad: true
    }
  ],
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981'
  }
};

// ============================================
// USAGE IN COMPONENTS
// ============================================

/*
// In your React component:

import { SectionRenderer, BatchSectionRenderer } from '@/components/renderers/SectionRenderer';
import { contactFormExample, projectsSectionExample } from '@/config/examples';

// Render single section
<SectionRenderer config={contactFormExample} useLazyLoad={true} />

// Render multiple sections
<BatchSectionRenderer sections={fullPageConfigurationExample.sections} useLazyLoad={true} />

// Render with custom loader
<SectionRenderer 
  config={projectsSectionExample}
  useLazyLoad={true}
  suspenseFallback={<CustomLoadingSpinner />}
/>
*/

export {
  contactFormExample,
  subscriptionFormExample,
  jobApplicationFormExample,
  projectsSectionExample,
  experienceSectionExample,
  skillsSectionExample,
  educationSectionExample,
  fullPageConfigurationExample
};
