const go = async () => {

  const rsvpDetails = await (await fetch(url + "?address=" + accAddress+ "&willId=" + willId)).json();
  if (rsvpDetails.timestamp > respData.coolDown + respData.initTimestamp) {
    return true;
  }
  return false;
};
