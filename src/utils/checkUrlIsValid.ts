const checkUrlIsValid = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

export default checkUrlIsValid;
