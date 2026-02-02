import { AEM_HOST } from '../constants/constants';

const resolveImage = (url: string) => {
  return `${AEM_HOST}${url}`;
};

export default resolveImage;
