import React, { useState, useEffect } from 'react';

const DistrictDataFetcher = () => {
  const [districtData, setDistrictData] = useState([]);
  const [subDistrictData, setSubDistrictData] = useState([]);
  const [assemblyData, setAssemblyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSubDistrict, setSelectedSubDistrict] = useState('');
  const [selectedLocal, setSelectedLocal] = useState('');
  const [selectedAssembly, setSelectedAssembly] = useState('');
  const [responseData, setResponseData] = useState(null); // State to store response data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://dcc-backend-qgm5.onrender.com/api/admin/districtV4');
        if (response.ok) {
          const jsonData = await response.json();
          setDistrictData(jsonData);
        } else {
          setError('Failed to fetch district data');
        }
      } catch (error) {
        setError('Error fetching district data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDistrictChange = async (event) => {
    const selectedDistrict = event.target.value;
    setSelectedDistrict(selectedDistrict);
    setSelectedSubDistrict('');

    // Fetch subdistrict data for the selected district
    try {
      const response = await fetch(`https://dcc-backend-qgm5.onrender.com/api/admin/districtV4?district=${selectedDistrict}`);
      if (response.ok) {
        const jsonData = await response.json();
        setSubDistrictData(jsonData);
      } else {
        setError('Failed to fetch subdistrict data');
      }
    } catch (error) {
      setError('Error fetching subdistrict data');
    }
  };

  const handleSubDistrictChange = async (event) => {
    const selectedSubDistrict = event.target.value;
    setSelectedSubDistrict(selectedSubDistrict);

    // Fetch assembly data for the selected district and subdistrict
    try {
      const response = await fetch(`https://dcc-backend-qgm5.onrender.com/api/admin/districtV4?district=${selectedDistrict}&constituency=${selectedSubDistrict}`);
      if (response.ok) {
        const jsonData = await response.json();
        setAssemblyData(jsonData);
      } else {
        setError('Failed to fetch assembly data');
      }
    } catch (error) {
      setError('Error fetching assembly data');
    }
  };

  const handleLocalChange = (event) => {
    const selectedLocal = event.target.value;
    setSelectedLocal(selectedLocal);
  };

  const handleAssemblyChange = (event) => {
    const selectedAssembly = event.target.value;
    setSelectedAssembly(selectedAssembly);
    
    // Send request only if all fields are selected
    if (selectedDistrict && selectedSubDistrict && selectedLocal) {
      // Fetch data for the selected assembly
      // You can adjust the URL and handling based on your API
      try {
        fetch(`https://dcc-backend-qgm5.onrender.com/api/admin/districtV4?district=${selectedDistrict}&constituency=${selectedSubDistrict}&assembly=${selectedAssembly}&local=${selectedLocal}`)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Failed to fetch assembly data');
            }
          })
          .then(jsonData => {
            setResponseData(jsonData); // Store response data in state
          })
          .catch(error => {
            setError('Error fetching assembly data');
          });
      } catch (error) {
        setError('Error fetching assembly data');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Select District</h2>
      <select value={selectedDistrict} onChange={handleDistrictChange}>
        <option value="">Select District</option>
        {districtData.map((district, index) => (
          <option key={index} value={district}>{district}</option>
        ))}
      </select>

      <h2>Select Sub-District</h2>
      <select value={selectedSubDistrict} onChange={handleSubDistrictChange} disabled={!selectedDistrict}>
        <option value="">Select Sub-District</option>
        {subDistrictData.map((subDistrict, index) => (
          <option key={index} value={subDistrict}>{subDistrict}</option>
        ))}
      </select>

      <h2>Local</h2>
      <label>
        <input type="radio" name="local" value="panchayath" onChange={handleLocalChange} /> Panchayat
      </label>
      <label>
        <input type="radio" name="local" value="municipality" onChange={handleLocalChange} /> Municipality
      </label>
      <label>
        <input type="radio" name="local" value="corporation" onChange={handleLocalChange} /> Corporation
      </label>

      <h2>Assembly</h2>
      <select value={selectedAssembly} onChange={handleAssemblyChange} disabled={!selectedSubDistrict || !selectedLocal}>
        <option value="">Select Assembly</option>
        {assemblyData.map((assembly, index) => (
          <option key={index} value={assembly}>{assembly}</option>
        ))}
      </select>

      {responseData && (
        <div>
          <h2>Response Data</h2>
          <select>
            <option value="">Select Data</option>
            {responseData.map((data, index) => (
              <option key={index} value={data}>{data}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default DistrictDataFetcher;
