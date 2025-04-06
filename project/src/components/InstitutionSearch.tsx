import React, { useState } from 'react';
import { Building2, MapPin, Globe, Users, GraduationCap, Briefcase, Search, X } from 'lucide-react';

interface Institution {
  id: string;
  name: string;
  type: 'university' | 'company' | 'research';
  location: string;
  website: string;
  description: string;
  imageUrl: string;
  details: {
    established?: string;
    ranking?: string;
    employees?: string;
    departments?: string[];
    facilities?: string[];
    programs?: string[];
    benefits?: string[];
  };
}

const sampleInstitutions: Institution[] = [
  {
    id: '1',
    name: 'Tokyo University',
    type: 'university',
    location: 'Bunkyo, Tokyo, Japan',
    website: 'www.u-tokyo.ac.jp',
    description: 'The University of Tokyo is Japan\'s leading university and one of Asia\'s most prestigious institutions of higher education.',
    imageUrl: 'https://images.unsplash.com/photo-1565034946487-077786996e27?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    details: {
      established: '1877',
      ranking: 'Top 1 in Japan',
      departments: ['Engineering', 'Science', 'Medicine', 'Law', 'Economics'],
      facilities: ['Research Labs', 'Libraries', 'Sports Facilities', 'Student Housing'],
      programs: ['Undergraduate', 'Graduate', 'Doctoral', 'Research']
    }
  },
  {
    id: '2',
    name: 'Sony Corporation',
    type: 'company',
    location: 'Minato, Tokyo, Japan',
    website: 'www.sony.com',
    description: 'Sony Corporation is a leading manufacturer of electronic products for consumer and professional markets.',
    imageUrl: 'https://images.unsplash.com/photo-1551808525-51fc5c7c6775?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    details: {
      established: '1946',
      employees: '114,400+',
      facilities: ['R&D Centers', 'Manufacturing Plants', 'Global Offices'],
      benefits: ['Health Insurance', 'Career Development', 'Global Opportunities', 'Work-Life Balance']
    }
  },
  {
    id: '3',
    name: 'RIKEN Research Institute',
    type: 'research',
    location: 'Wako, Saitama, Japan',
    website: 'www.riken.jp',
    description: 'RIKEN is Japan\'s largest comprehensive research institution renowned for high-quality research in a diverse range of scientific disciplines.',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    details: {
      established: '1917',
      facilities: ['Advanced Research Labs', 'Supercomputer Center', 'Specialized Equipment'],
      departments: ['Physics', 'Chemistry', 'Biology', 'Medical Science', 'Engineering'],
      programs: ['Research Projects', 'International Collaboration', 'PhD Programs']
    }
  }
];

export default function InstitutionSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [institutionType, setInstitutionType] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

  const filteredInstitutions = sampleInstitutions.filter(institution => {
    const matchesSearch = institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         institution.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = institutionType === 'all' || institution.type === institutionType;
    return matchesSearch && matchesType;
  });

  const InstitutionCard = ({ institution }: { institution: Institution }) => {
    const TypeIcon = {
      university: GraduationCap,
      company: Briefcase,
      research: Globe
    }[institution.type];

    return (
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setSelectedInstitution(institution)}
      >
        <img src={institution.imageUrl} alt={institution.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <div className="flex items-center mb-2">
            <TypeIcon className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">{institution.name}</h3>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{institution.location}</span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">{institution.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or location"
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg"
          value={institutionType}
          onChange={(e) => setInstitutionType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="university">Universities</option>
          <option value="company">Companies</option>
          <option value="research">Research Institutes</option>
        </select>
      </div>

      {filteredInstitutions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No institutions found. Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInstitutions.map(institution => (
            <InstitutionCard key={institution.id} institution={institution} />
          ))}
        </div>
      )}

      {/* Institution Details Modal */}
      {selectedInstitution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedInstitution.name}</h2>
                <button
                  onClick={() => setSelectedInstitution(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <img
                src={selectedInstitution.imageUrl}
                alt={selectedInstitution.name}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />

              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {selectedInstitution.location}
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    <a href={`https://${selectedInstitution.website}`} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline">
                      {selectedInstitution.website}
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-gray-600">{selectedInstitution.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {selectedInstitution.details.established && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-1">Established</h4>
                      <p>{selectedInstitution.details.established}</p>
                    </div>
                  )}
                  {selectedInstitution.details.ranking && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-1">Ranking</h4>
                      <p>{selectedInstitution.details.ranking}</p>
                    </div>
                  )}
                  {selectedInstitution.details.employees && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-1">Employees</h4>
                      <p>{selectedInstitution.details.employees}</p>
                    </div>
                  )}
                </div>

                {selectedInstitution.details.departments && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Departments</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInstitution.details.departments.map((dept, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedInstitution.details.facilities && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Facilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInstitution.details.facilities.map((facility, index) => (
                        <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedInstitution.details.programs && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Programs</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInstitution.details.programs.map((program, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedInstitution.details.benefits && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInstitution.details.benefits.map((benefit, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Contact Institution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}