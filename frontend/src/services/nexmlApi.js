import api from './api';

export const uploadDataset = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const fetchDatasetInfo = () => api.get('/dataset-info');

export const selectTargetColumn = (targetColumn) =>
  api.post('/select-target', { target_column: targetColumn });

export const requestTraining = () => api.post('/train');

export const requestPrediction = (features) => api.post('/predict', { features });

export const downloadModel = () => api.get('/download-model');

export const downloadReport = () => api.get('/download-report');