import axios from "axios";
const URL = `${window.location.origin}/api`;

export const GetReportApi = async (data) => {
  const result = await axios
    .get(
      `${URL}/report?sortBy=${data.sortBy}&isDescending=${data.isDescending}&location=${data.location}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    )
    .then((res) => res);
  return result;
};

