import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [peopleData, setPeopleData] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollToTop, setScrollToTop] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://602e7c2c4410730017c50b9d.mockapi.io/users');
      const data = response.data;
      setPeopleData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePersonClick = (person) => {
    setSelectedPerson((prevSelectedPerson) => {
      return prevSelectedPerson === person ? null : person;
    });
  };

  const getAvatarUrl = (url) => `https://cors-anywhere.herokuapp.com/${url}`;
  const detailsRef = useRef();

  useEffect(() => {
    if (scrollToTop && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
      setScrollToTop(false);
    }
  }, [scrollToTop]);

  return (
    <div className="App">
      <h1 style={{ color: 'red' }}>List</h1>
      <div className="container">
        <div className="left">
          <button className="List-top">List of Persons</button>
          <p>Total Persons in API: {peopleData.length}</p>
          {isLoading ? (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <div>
              {peopleData.map((person, index) => (
                <div
                  key={index}
                  className={`person ${selectedPerson === person ? 'active' : ''}`}
                  onClick={() => handlePersonClick(person)}
                >
                  <img
                    src={getAvatarUrl(person.avatar)}
                    alt={person.profile.firstName}
                    className="person-image"
                  />
                  <span className="person-name">
                    {person.profile.firstName} {person.profile.lastName}
                  </span>
                </div>
              ))}
            </div>
          )}
          <p>Persons Displayed: {peopleData.length}</p>
        </div>

        <div className="right">
          <button className='disabled-button'>Details</button>
          {selectedPerson ? (
            <div ref={detailsRef} className="details">
              <img src={getAvatarUrl(selectedPerson.avatar)} alt={selectedPerson.profile.firstName} />
              <p>Name: {selectedPerson.profile.firstName} {selectedPerson.profile.lastName}</p>
              <p>Created at: {selectedPerson.createdAt}</p>
              <p>Email: {selectedPerson.profile.email}</p>
              <p>ID: {selectedPerson.id}</p>
              <p>Job: {selectedPerson.jobTitle}</p>
              <p>Bio: {selectedPerson.Bio}</p>
            </div>
          ) : (
            <div className="details-placeholder">Select a person to see details</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
