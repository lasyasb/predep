import React, { useState } from 'react';
import { Plane, Languages, Home as HomeIcon, Building2, X, CheckCircle, AlertCircle } from 'lucide-react';
import LanguageLearning from '../components/LanguageLearning';
import AccommodationSearch from '../components/AccommodationSearch';
import InstitutionSearch from '../components/InstitutionSearch';

interface VisaRequirement {
  name: string;
  description: string;
  required: boolean;
}

interface CountryVisaInfo {
  country: string;
  processingTime: string;
  fee: string;
  requirements: VisaRequirement[];
  steps: string[];
  embassyContact: {
    address: string;
    phone: string;
    email: string;
    website: string;
    emergencyContact: string;
    workingHours: string;
  };
}

export default function PreDepartureDashboard() {
  const [showVisaModal, setShowVisaModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('japan');

  const visaInfo: Record<string, CountryVisaInfo> = {
    japan: {
      country: 'Japan',
      processingTime: '5-7 working days',
      fee: '¥3,000',
      requirements: [
        { name: 'Valid Passport', description: 'Must be valid for at least 6 months beyond your stay', required: true },
        { name: 'Visa Application Form', description: 'Completed and signed application form', required: true },
        { name: 'Passport Photos', description: '2 recent photos (45mm x 45mm)', required: true },
        { name: 'Bank Statement', description: 'Last 3 months bank statements', required: true },
        { name: 'Certificate of Eligibility', description: 'Original CoE from Japanese institution', required: true },
        { name: 'Flight Itinerary', description: 'Round trip flight booking', required: false },
      ],
      steps: [
        'Obtain Certificate of Eligibility (CoE) from your sponsor in Japan',
        'Gather all required documents',
        'Submit application at Japanese embassy/consulate',
        'Pay visa fee',
        'Wait for processing',
        'Collect passport with visa'
      ],
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
      processingTime: '2-3 weeks',
      fee: '$160',
      requirements: [
        { name: 'Valid Passport', description: 'Must be valid for at least 6 months beyond your stay', required: true },
        { name: 'DS-160 Form', description: 'Completed online nonimmigrant visa application', required: true },
        { name: 'I-20 Form', description: 'For students (F-1 visa)', required: true },
        { name: 'Financial Documents', description: 'Proof of sufficient funds', required: true },
        { name: 'Interview', description: 'Visa interview at US embassy', required: true },
        { name: 'SEVIS Fee Receipt', description: 'Payment confirmation of SEVIS fee', required: true }
      ],
      steps: [
        'Complete DS-160 form online',
        'Pay visa fee',
        'Schedule visa interview',
        'Prepare documents',
        'Attend visa interview',
        'Wait for visa processing'
      ],
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
      processingTime: '4-5 working days',
      fee: '¥160',
      requirements: [
        { name: 'Valid Passport', description: 'Must be valid for at least 6 months with blank visa pages', required: true },
        { name: 'Visa Application Form', description: 'Form V.2013 filled and signed', required: true },
        { name: 'Photos', description: '2 recent passport photos (48mm x 33mm)', required: true },
        { name: 'Invitation Letter', description: 'Official invitation from a Chinese entity', required: true },
        { name: 'Flight Booking', description: 'Round-trip flight reservation', required: true },
        { name: 'Hotel Booking', description: 'Accommodation proof for entire stay', required: false }
      ],
      steps: [
        'Obtain invitation letter from Chinese sponsor',
        'Complete visa application form',
        'Gather supporting documents',
        'Submit application at Chinese embassy',
        'Pay visa fee',
        'Collect passport with visa'
      ],
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
      processingTime: '5-7 working days',
      fee: '₩60,000',
      requirements: [
        { name: 'Valid Passport', description: 'Minimum 6 months validity from entry date', required: true },
        { name: 'Visa Application Form', description: 'Completed form with recent photo', required: true },
        { name: 'Photos', description: '1 color photo (35mm x 45mm)', required: true },
        { name: 'Bank Statement', description: 'Last 3 months statements', required: true },
        { name: 'Employment Letter', description: 'Current employment verification', required: true },
        { name: 'Travel Insurance', description: 'Valid for entire stay period', required: false }
      ],
      steps: [
        'Fill out visa application form',
        'Prepare required documents',
        'Submit application at Korean embassy',
        'Pay visa fee',
        'Wait for processing',
        'Collect passport'
      ],
      embassyContact: {
        address: '2450 Massachusetts Avenue NW, Washington, DC 20008, United States',
        phone: '+1 (202) 939-5600',
        email: 'consular@koreaembassy.org',
        website: 'http://overseas.mofa.go.kr/us-en/index.do',
        emergencyContact: '+1 (202) 641-4034',
        workingHours: 'Monday-Friday: 9:00 AM - 5:00 PM (except Korean and U.S. holidays)'
      }
    },
    australia: {
      country: 'Australia',
      processingTime: '15-20 working days',
      fee: 'AUD 145',
      requirements: [
        { name: 'Valid Passport', description: 'At least 6 months validity from planned departure', required: true },
        { name: 'Visa Application', description: 'Online application form', required: true },
        { name: 'Digital Photo', description: 'Recent passport-style photograph', required: true },
        { name: 'Financial Proof', description: 'Bank statements showing sufficient funds', required: true },
        { name: 'Health Insurance', description: 'Overseas health coverage proof', required: true },
        { name: 'Character Certificate', description: 'Police clearance certificate', required: false }
      ],
      steps: [
        'Create ImmiAccount online',
        'Complete online application',
        'Upload supporting documents',
        'Pay visa fee',
        'Wait for processing',
        'Receive visa notification'
      ],
      embassyContact: {
        address: '1601 Massachusetts Avenue NW, Washington, DC 20036, United States',
        phone: '+1 (202) 797-3000',
        email: 'austemb.washington@dfat.gov.au',
        website: 'https://usa.embassy.gov.au',
        emergencyContact: '+1 (202) 797-3000 (24/7 Consular Emergency Centre)',
        workingHours: 'Monday-Friday: 8:30 AM - 5:00 PM (except Australian and U.S. holidays)'
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Pre-Departure Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visa & Passport Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <Plane className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold">Visa & Passport Progress</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="mb-4">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Destination Country
                </label>
                <select
                  id="country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <option value="japan">Japan</option>
                  <option value="usa">United States</option>
                  <option value="china">China</option>
                  <option value="korea">South Korea</option>
                  <option value="australia">Australia</option>
                </select>
              </div>
              <button
                onClick={() => setShowVisaModal(true)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Visa Requirements
              </button>
            </div>
          </div>
        </div>

        {/* Language Learning Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <Languages className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold">Language Learning</h2>
          </div>
          <LanguageLearning selectedCountry={selectedCountry} />
        </div>

        {/* Accommodation Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg col-span-2">
          <div className="flex items-center mb-4">
            <HomeIcon className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold">Accommodation Search</h2>
          </div>
          <AccommodationSearch />
        </div>

        {/* Institution Guide Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg col-span-2">
          <div className="flex items-center mb-4">
            <Building2 className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold">Institution Information</h2>
          </div>
          <InstitutionSearch />
        </div>
      </div>

      {/* Visa Information Modal */}
      {showVisaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Visa Requirements for {visaInfo[selectedCountry].country}
                </h2>
                <button
                  onClick={() => setShowVisaModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">Processing Time</p>
                    <p className="text-gray-600">{visaInfo[selectedCountry].processingTime}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">Visa Fee</p>
                    <p className="text-gray-600">{visaInfo[selectedCountry].fee}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Required Documents</h3>
                  <div className="space-y-3">
                    {visaInfo[selectedCountry].requirements.map((req, index) => (
                      <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg">
                        {req.required ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium">{req.name}</p>
                          <p className="text-sm text-gray-600">{req.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Application Process</h3>
                  <ol className="space-y-2">
                    {visaInfo[selectedCountry].steps.map((step, index) => (
                      <li key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Embassy Contact Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <p><strong>Address:</strong> {visaInfo[selectedCountry].embassyContact.address}</p>
                    <p><strong>Phone:</strong> {visaInfo[selectedCountry].embassyContact.phone}</p>
                    <p><strong>Email:</strong> {visaInfo[selectedCountry].embassyContact.email}</p>
                    <p><strong>Website:</strong> <a href={visaInfo[selectedCountry].embassyContact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{visaInfo[selectedCountry].embassyContact.website}</a></p>
                    <p><strong>Emergency Contact:</strong> {visaInfo[selectedCountry].embassyContact.emergencyContact}</p>
                    <p><strong>Working Hours:</strong> {visaInfo[selectedCountry].embassyContact.workingHours}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowVisaModal(false)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}