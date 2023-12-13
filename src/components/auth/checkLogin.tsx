export const checkLogin = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.decoded.role === 1) {
                window.location.href = '/superadmin'
            } else if (result.decoded.role === 2) {
                window.location.href = '/admin'
            } else if (result.decoded.role === 3) {
                window.location.href = '/'
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
};
