const response = (data) => {
  if (data.success) {
    return data;
  }
  window.location = '/login';
};

export const fetchEntity = async (api, params) => {
  try {
    const { data } = await api(params);
    return response(data);
  } catch (error) {
    console.log('Cannot fetch data: error = ', error);
  }
};
