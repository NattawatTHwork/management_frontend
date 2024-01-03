export const checkLoginSuperAdmin = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      });
  
      const result = await response.json();
  
      if (result.status === 'success' && result.decoded.role === 1) {
        // alert('authen success')
      } else {
        localStorage.removeItem('token');
        window.location.href = '/superadminlogin';
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  