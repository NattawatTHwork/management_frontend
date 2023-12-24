export const checkLoginLayout = async () => {
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
            return result.decoded;
        } catch (error) {
            console.error('Error:', error);
        }
    }
};
