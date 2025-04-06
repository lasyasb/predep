import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Globe, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EmbassyContact {
  address: string;
  phone: string;
  email: string;
  website: string;
  emergencyContact: string;
  workingHours: string;
}

interface CountryEmbassy {
  country: string;
  embassyContact: EmbassyContact;
}

export default function HelpSupport() {
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserCountry();
  }, []);

  const fetchUserCountry = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('location')
        .eq('id', user.id)
        .single();

      if (profile?.location) {
        setUserCountry(profile.location.toLowerCase());
      }
    } catch (error) {
      console.error('Error fetching user country:', error);
    } finally {
      setLoading(false);
    }
  };

  const embassyInfo: Record<string, CountryEmbassy> = {
    japan: {
      country: 'Japan',
      embassyContact: {
        address: '2520 Massachusetts Avenue NW, Washington, DC 20008, United States',
        phone: '+1 (202) 238-6700',
        email: 'visa@ws.mofa.go.jp',
        website: 'https://www.us.emb-japan.go.jp',
        emergencyContact: '+1 (202) 238-6800',
        workingHours: 'Monday-Friday: 9:00 AM - 5:00 PM (except Japanese and U.S. holidays)'
      }
    },
    usa: {
      country: 'United States',
      embassyContact: {
        address: '1-10-5 Akasaka, Minato-ku, Tokyo 107-8420, Japan',
        phone: '+81-3-3224-5000',
        email: 'tokyoacs@state.gov',
        website: 'https://jp.usembassy.gov',
        emergencyContact: '+81-3-3224-5000 (After hours emergencies)',
        workingHours: 'Monday-Friday: 8:30 AM - 5:30 PM (except U.S. and Japanese holidays)'
      }
    },
    china: {
      country: 'China',
      embassyContact: {
        address: '3505 International Place NW, Washington, DC 20008, United States',
        phone: '+1 (202) 495-2266',
        email: 'chinaembpress_us@mfa.gov.cn',
        website: 'http://www.china-embassy.org',
        emergencyContact: '+1 (202) 495-2216',
        workingHours: 'Monday-Friday: 9:00 AM - 5:00 PM (except Chinese and U.S. holidays)'
      }
    },
    korea: {
      country: 'South Korea',
      embassyContact: {
        address: '2450 Massachusetts Avenue NW, Washington, DC 20008, United States',
        phone: '+1 (202) 939-5600',
        email: 'consular@koreaembassy.org',
        website: 'http://overseas.mofa.go.kr/us-en/index.do',
        emergencyContact: '+1 (202) 641-4034',
        workingHours: 'Monday-Friday: 9:00 AM - 5:00 PM (except Korean and U.S. holidays)'
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!userCountry || !embassyInfo[userCountry]) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600">
          Please update your profile with your current location to see relevant embassy information.
        </p>
      </div>
    );
  }

  const embassy = embassyInfo[userCountry];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">
            {embassy.country} Embassy Contact Information
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-gray-500 mt-1 mr-3" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-gray-600">{embassy.embassyContact.address}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Phone className="w-5 h-5 text-gray-500 mt-1 mr-3" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-gray-600">{embassy.embassyContact.phone}</p>
            </div>
          </div>

          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-1 mr-3" />
            <div>
              <p className="font-medium">Emergency Contact</p>
              <p className="text-gray-600">{embassy.embassyContact.emergencyContact}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Mail className="w-5 h-5 text-gray-500 mt-1 mr-3" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-gray-600">{embassy.embassyContact.email}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Globe className="w-5 h-5 text-gray-500 mt-1 mr-3" />
            <div>
              <p className="font-medium">Website</p>
              <a
                href={embassy.embassyContact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {embassy.embassyContact.website}
              </a>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="w-5 h-5 text-gray-500 mt-1 mr-3" />
            <div>
              <p className="font-medium">Working Hours</p>
              <p className="text-gray-600">{embassy.embassyContact.workingHours}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertCircle className="w-5 h-5 text-yellow-500 mt-1 mr-3" />
          <div>
            <p className="font-medium text-yellow-800">Important Notice</p>
            <p className="text-yellow-700 text-sm">
              For emergencies outside of working hours, please use the emergency contact number.
              Keep this information readily available during your stay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}