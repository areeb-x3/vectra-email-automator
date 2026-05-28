import axios from 'axios';

// Create a configured Axios instance
const api = axios.create({
  baseURL: '', // Relative URL so it is automatically handled by the Vite proxy in development
  withCredentials: true, // Send session cookies and headers along with requests
  xsrfCookieName: 'csrftoken', // Automatically extract CSRF token from Django cookie
  xsrfHeaderName: 'X-CSRFToken', // Attach CSRF token to this header
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Authentication APIs
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/api/login/', { email, password });
    return response.data;
  },
  signup: async (firstName, lastName, email, password, confirmPassword) => {
    const response = await api.post('/api/signup/', {
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/api/logout/');
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/api/user/');
    return response.data;
  }
};

// Scheduler / Campaigns APIs
export const schedulerAPI = {
  listSchedules: async (userId) => {
    const response = await api.get(`/api/list/${userId}/`);
    return response.data;
  },
  createSchedule: async (data) => {
    const response = await api.post('/api/create/', data);
    return response.data;
  },
  modifySchedule: async (scheduleId, data) => {
    const response = await api.post(`/api/modify/${scheduleId}/`, data);
    return response.data;
  },
  deleteSchedule: async (scheduleId) => {
    const response = await api.post(`/api/delete/${scheduleId}/`);
    return response.data;
  }
};

// Email Handler / Template APIs
export const emailAPI = {
  createTemplate: async (name, subject, body) => {
    const response = await api.post('/api/templates/create/', { name, subject, body });
    return response.data;
  },
  sendBulkMail: async (subject, body, groupIds) => {
    const response = await api.post('/api/send-bulk-mail/', { subject, body, group_ids: groupIds });
    return response.data;
  }
};

// Organisation & Contact APIs
export const orgAPI = {
  createOrganisation: async (formData) => {
    const response = await api.post('/api/create-organisation/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  modifyOrganisation: async (formData) => {
    const response = await api.post('/api/modify-organisation/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  deleteOrganisation: async (orgId) => {
    const formData = new FormData();
    formData.append('organisation_id', orgId);
    const response = await api.post('/api/delete-organisation/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  createGroup: async (name, recipients, orgId) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('recipients', recipients);
    formData.append('org_id', orgId);
    const response = await api.post('/api/create-group/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  modifyGroup: async (name, recipients, orgId, groupId) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('recipients', recipients);
    formData.append('org_id', orgId);
    formData.append('group_id', groupId);
    const response = await api.post('/api/modify-group/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  deleteGroup: async (orgId, groupId) => {
    const formData = new FormData();
    formData.append('org_id', orgId);
    formData.append('group_id', groupId);
    const response = await api.post('/api/delete-group/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default api;
