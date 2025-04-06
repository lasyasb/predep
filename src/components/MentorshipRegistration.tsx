import React, { useState } from 'react';
import { GraduationCap, Briefcase, MapPin, Languages, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface MentorshipFormData {
  expertise: string[];
  languages: string[];
  availability: string;
  experience: string;
  bio: string;
}

export default function MentorshipRegistration() {
  const [formData, setFormData] = useState<MentorshipFormData>({
    expertise: [],
    languages: [],
    availability: '',
    experience: '',
    bio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const expertiseOptions = [
    'Academic Guidance',
    'Career Development',
    'Cultural Integration',
    'Language Learning',
    'Local Navigation',
    'Housing Assistance',
    'Visa & Immigration',
    'Healthcare System'
  ];

  const languageOptions = [
    'English',
    'Japanese',
    'Mandarin',
    'Korean',
    'Spanish',
    'French',
    'German'
  ];

  const handleExpertiseChange = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }));
  };

  const handleLanguageChange = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('mentors')
        .insert({
          user_id: user.id,
          expertise: formData.expertise,
          languages: formData.languages,
          availability: formData.availability,
          experience: formData.experience,
          bio: formData.bio,
          status: 'pending'
        });

      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      console.error('Error registering as mentor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <GraduationCap className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Thank You for Registering!</h3>
        <p className="text-gray-600">
          Your mentorship application has been submitted. We'll review your application and get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Areas of Expertise
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {expertiseOptions.map(expertise => (
            <label
              key={expertise}
              className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                formData.expertise.includes(expertise)
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={formData.expertise.includes(expertise)}
                onChange={() => handleExpertiseChange(expertise)}
              />
              <span className="text-sm">{expertise}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages Spoken
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {languageOptions.map(language => (
            <label
              key={language}
              className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                formData.languages.includes(language)
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={formData.languages.includes(language)}
                onChange={() => handleLanguageChange(language)}
              />
              <span className="text-sm">{language}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Availability
        </label>
        <select
          className="w-full p-3 border rounded-lg"
          value={formData.availability}
          onChange={e => setFormData(prev => ({ ...prev, availability: e.target.value }))}
          required
        >
          <option value="">Select availability</option>
          <option value="flexible">Flexible</option>
          <option value="weekdays">Weekdays</option>
          <option value="weekends">Weekends</option>
          <option value="evenings">Evenings</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Relevant Experience
        </label>
        <textarea
          className="w-full p-3 border rounded-lg"
          rows={3}
          value={formData.experience}
          onChange={e => setFormData(prev => ({ ...prev, experience: e.target.value }))}
          placeholder="Share your experience living abroad, helping others, etc."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          className="w-full p-3 border rounded-lg"
          rows={4}
          value={formData.bio}
          onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell us about yourself and why you want to be a mentor"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || formData.expertise.length === 0 || formData.languages.length === 0}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Register as Mentor'}
      </button>
    </form>
  );
}