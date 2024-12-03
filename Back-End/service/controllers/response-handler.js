export const setSuccess = (data, response, status = 200) => {
    response.status(status).json({
        success: true,
        ...data,
        statusCode: status
    });
};

export const setError = (error, response, status = 400) => {
    let message = error.message || 'An error occurred';
    let errors = error.errors || null;

    // Map status to specific error messages if needed
    if (status === 404) {
        message = 'Not Found - Resource not found';
    } else if (status === 500) {
        message = 'Internal Server Error';
    } else if (status === 503) {
        message = 'Service Unavailable';
    } else if (status === 400 && !error.message) {
        message = 'Bad Request - Missing or invalid parameters';
    } else if (status === 401) {
        message = 'Unauthorized - Invalid credentials';
    } 
    response.status(status).json({
        success: false,
        message,
        statusCode: status,
        ...(errors && { errors }) // Only include errors if they exist
    });
};