/**
 * Helper function để gọi API với logging tự động
 * @param {string} url - URL API
 * @param {Object} options - Options cho fetch (method, headers, body, etc.)
 * @param {boolean} enableLogging - Bật/tắt logging (mặc định: true)
 * @returns {Promise<Object>} - Response data
 */
export const apiFetch = async (url, options = {}, enableLogging = true) => {
  const startTime = Date.now();
  
  try {
    // Log request
    if (enableLogging) {
      console.group(`🚀 API Request: ${options.method || 'GET'} ${url}`);
      console.log('Request Options:', options);
      if (options.body) {
        console.log('Request Body:', JSON.parse(options.body));
      }
      console.groupEnd();
    }

    const response = await fetch(url, options);
    const responseTime = Date.now() - startTime;

    // Log response
    if (enableLogging) {
      console.group(`📡 API Response: ${response.status} ${response.statusText}`);
      console.log('Response Time:', `${responseTime}ms`);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    }

    // Nếu status không phải 200, log chi tiết để debug
    if (!response.ok) {
      let errorData = null;
      try {
        errorData = await response.clone().json();
      } catch (e) {
        // Nếu không parse được JSON, lấy text
        errorData = await response.clone().text();
      }

      if (enableLogging) {
        console.error('❌ API Error Response:');
        console.error('Status:', response.status);
        console.error('Status Text:', response.statusText);
        console.error('Error Data:', errorData);
        console.error('Response URL:', response.url);
        console.groupEnd();
      }

      // Throw error với thông tin chi tiết
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.statusText = response.statusText;
      error.data = errorData;
      error.url = response.url;
      error.responseTime = responseTime;
      throw error;
    }

    // Parse response data
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Log success response
    if (enableLogging) {
      console.log('✅ API Success Response:');
      console.log('Data:', data);
      console.groupEnd();
    }

    return {
      success: true,
      data,
      status: response.status,
      statusText: response.statusText,
      responseTime,
      headers: Object.fromEntries(response.headers.entries())
    };

  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (enableLogging) {
      console.error('💥 API Fetch Error:');
      console.error('Error:', error);
      console.error('Response Time:', `${responseTime}ms`);
      console.error('URL:', url);
      console.groupEnd();
    }

    // Thêm thông tin bổ sung vào error
    error.url = url;
    error.responseTime = responseTime;
    error.requestOptions = options;
    
    throw error;
  }
};

/**
 * Helper function để gọi API với method cụ thể
 */
export const api = {
  get: (url, options = {}, enableLogging = true) => 
    apiFetch(url, { ...options, method: 'GET' }, enableLogging),
  
  post: (url, data, options = {}, enableLogging = true) => 
    apiFetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    }, enableLogging),
  
  put: (url, data, options = {}, enableLogging = true) => 
    apiFetch(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    }, enableLogging),
  
  delete: (url, options = {}, enableLogging = true) => 
    apiFetch(url, { ...options, method: 'DELETE' }, enableLogging),
  
  patch: (url, data, options = {}, enableLogging = true) => 
    apiFetch(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    }, enableLogging)
};

