const AEM_HOST = "http://localhost:4502";

const resolveImage = (url: string) => {
  return `${AEM_HOST}${url}`;
};

export default resolveImage;
