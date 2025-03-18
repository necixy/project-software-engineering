const messageId = (cUId: any, id: any) => {
  const newId = cUId > id ? cUId : id;
  let generatedId = '';
  if (newId === cUId) {
    generatedId = `${newId}-${id}`;
  } else {
    generatedId = `${newId}-${cUId}`;
  }
  return generatedId;
};
export default messageId;
