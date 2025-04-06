import React, { useState } from 'react';
import { Home, Building2, Hotel, MapPin, BedDouble, Bath, Wifi, DollarSign } from 'lucide-react';

interface Property {
  id: string;
  type: 'apartment' | 'house' | 'dormitory' | 'shared';
  title: string;
  location: string;
  price: number;
  currency: string;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  available: string;
  description: string;
}

const sampleProperties: Record<string, Property[]> = {
  tokyo: [
    {
      id: '1',
      type: 'apartment',
      title: 'Modern Studio in Shinjuku',
      location: 'Shinjuku, Tokyo',
      price: 95000,
      currency: '¥',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      bedrooms: 1,
      bathrooms: 1,
      amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Washing Machine'],
      available: '2024-04-01',
      description: 'Cozy studio apartment in the heart of Shinjuku. Walking distance to stations and shopping areas.'
    },
    {
      id: '2',
      type: 'shared',
      title: 'Share House in Setagaya',
      location: 'Setagaya, Tokyo',
      price: 65000,
      currency: '¥',
      imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      bedrooms: 1,
      bathrooms: 2,
      amenities: ['WiFi', 'Shared Kitchen', 'Laundry Room', 'Common Area'],
      available: '2024-03-15',
      description: 'Private room in a friendly share house. Great for students and young professionals.'
    }
  ],
  seoul: [
    {
      id: '3',
      type: 'apartment',
      title: 'Gangnam Studio Apartment',
      location: 'Gangnam, Seoul',
      price: 1200000,
      currency: '₩',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      bedrooms: 1,
      bathrooms: 1,
      amenities: ['WiFi', 'Security System', 'Gym', 'Rooftop Garden'],
      available: '2024-04-01',
      description: 'Modern studio in Gangnam area with great amenities and convenient location.'
    }
  ],
  beijing: [
    {
      id: '4',
      type: 'apartment',
      title: 'Chaoyang District Apartment',
      location: 'Chaoyang, Beijing',
      price: 8000,
      currency: '¥',
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      bedrooms: 2,
      bathrooms: 1,
      amenities: ['WiFi', 'Heating', 'Air Conditioning', 'Parking'],
      available: '2024-03-20',
      description: 'Spacious 2-bedroom apartment in the heart of Chaoyang District.'
    }
  ]
};

export default function AccommodationSearch() {
  const [searchCity, setSearchCity] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filterProperties = (properties: Property[]) => {
    return properties.filter(property => {
      if (propertyType !== 'all' && property.type !== propertyType) return false;
      if (priceRange !== 'all') {
        const price = property.price;
        switch (priceRange) {
          case 'low':
            return price < 70000;
          case 'medium':
            return price >= 70000 && price < 100000;
          case 'high':
            return price >= 100000;
          default:
            return true;
        }
      }
      return true;
    });
  };

  const getPropertiesForCity = () => {
    const cityKey = searchCity.toLowerCase();
    return sampleProperties[cityKey] || [];
  };

  const properties = searchCity ? filterProperties(getPropertiesForCity()) : [];

  const PropertyCard = ({ property }: { property: Property }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
         onClick={() => setSelectedProperty(property)}>
      <img src={property.imageUrl} alt={property.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-gray-600">
            <BedDouble className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.bedrooms} Bed</span>
            <Bath className="w-4 h-4 ml-3 mr-1" />
            <span className="text-sm">{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center text-blue-600 font-semibold">
            <DollarSign className="w-4 h-4" />
            {property.currency}{property.price.toLocaleString()}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Enter city name (e.g., Tokyo, Seoul)"
          className="px-4 py-2 border rounded-lg"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <select
          className="px-4 py-2 border rounded-lg"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="all">All Property Types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="dormitory">Dormitory</option>
          <option value="shared">Shared Room</option>
        </select>
        <select
          className="px-4 py-2 border rounded-lg"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          <option value="all">All Price Ranges</option>
          <option value="low">Budget (&lt; JPY 70,000)</option>
          <option value="medium">Mid-Range (JPY 70,000 - 100,000)</option>
          <option value="high">Luxury (&gt; JPY 100,000)</option>
        </select>
      </div>

      {searchCity && properties.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No properties found in {searchCity}. Try another city or adjust filters.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedProperty.title}</h2>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <img
                src={selectedProperty.imageUrl}
                alt={selectedProperty.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  {selectedProperty.location}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <BedDouble className="w-5 h-5 mr-1" />
                      {selectedProperty.bedrooms} Bedroom(s)
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-5 h-5 mr-1" />
                      {selectedProperty.bathrooms} Bathroom(s)
                    </div>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {selectedProperty.currency}{selectedProperty.price.toLocaleString()}/month
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{selectedProperty.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map((amenity, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Available From</h3>
                  <p className="text-gray-600">{selectedProperty.available}</p>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Contact Property Manager
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}