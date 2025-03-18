import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://data.fixer.io/api/convert?access_key=df6bfe713f651ec03d9dfb359035ef0d',
  params: {
    from: 'USD',
    to: 'INR',
    amount: 100,
  },
};

export const convertCurrency = async () => {
  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
