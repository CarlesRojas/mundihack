const isFromGithub = (url: string) => {
  return url.includes('github.com');
};

const checkUrlIsValid = (url: string, github?: boolean) => {
  try {
    new URL(url);
    if (!github) return true;
    else return isFromGithub(url);
  } catch (err) {
    return false;
  }
};

export default checkUrlIsValid;
