import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');
  const [analytics, setAnalytics] = useState(null);

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        studentId: 'S003',
        password: 'password789' // Ensure this matches
      });
      setToken(response.data.token);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const logout = () => {
    setToken('');
    setAnalytics(null);
  };

  useEffect(() => {
    if (token) {
      const fetchAnalytics = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/auth/analytics?studentId=S003', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAnalytics(response.data);
        } catch (err) {
          console.error('Analytics error:', err);
        }
      };
      fetchAnalytics();
    }
  }, [token]);

  return (
    <div>
      {!token ? (
        <button onClick={login}>Login</button>
      ) : (
        <>
          <button onClick={logout}>Logout</button>
          {analytics && (
            <div>
              <p>Total Classes: {analytics.totalClasses}</p>
              <p>Present Days: {analytics.presentDays}</p>
              <p>Attendance Percentage: {analytics.attendancePercentage}%</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;