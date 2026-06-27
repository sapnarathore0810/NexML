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

export const fetchDatasetInfo = (filename) => api.get(`/preview/${encodeURIComponent(filename)}`);

export const selectTargetColumn = (targetColumn) =>
  api.post('/select-target', { target_column: targetColumn });

export const preprocessDataset = (filename, targetColumn) =>
  api.post('/preprocess', { filename, target_column: targetColumn });

export const requestTraining = (filename, targetColumn) =>
  api.post('/train', { filename, target_column: targetColumn });

export const requestPrediction = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post('/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const downloadModel = () => api.get('/download-model');

export const downloadPredictions = () => api.get('/download-predictions');

export const downloadMetrics = () => api.get('/download-metrics');

export const downloadPreprocessingReport = () => api.get('/download-preprocessing-report');

export const downloadReport = () => api.get('/download-report');