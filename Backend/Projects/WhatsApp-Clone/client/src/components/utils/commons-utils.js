const formatDate = (date) => {
  if (!date) return "";
  const hours = new Date(date).getHours();
  const minutes = new Date(date).getMinutes();
  return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
};

export const downloadMedia = async (e, originalImage) => {
  e.preventDefault();
  try {
    const response = await fetch(originalImage);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;

    const nameSplit = originalImage.split("/");
    const duplicateName = nameSplit.pop();
    a.download = "" + decodeURIComponent(duplicateName) + "";

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.log("Error while downloading the media:", error.message);
  }
};

export default formatDate;
