const parseName = (completeName?: string | null) => {
  const name = completeName?.split(' ');
  const firstName = name && name.length > 0 ? name[0] : 'anonymous';
  const lastName = name && name.length > 1 ? name[1] : '';

  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
  };
};

export default parseName;
