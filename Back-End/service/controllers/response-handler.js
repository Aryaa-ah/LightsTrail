export const setSuccess = (data, response, status = 200) => {
    response.status(status).json(
        
        data
    );
};

export const setError = (error, response, status = 400) => {
    let message = error.message || 'An error occurred';

    // Map status to specific error messages if needed
    if (status === 404) {
        message = 'Not Found - Resourse not found';
    } else if (status === 500) {
        message = 'Internal Server Error';
    } else if (status === 503) {
        message = 'Service Unavailable';
    } else if (status === 400) {
        message = 'Bad Request - Missing or invalid parameters';
    }

    response.status(status).json({
       
            message,
            code: status,
        
    });
};
