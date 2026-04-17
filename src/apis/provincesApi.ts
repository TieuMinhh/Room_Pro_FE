import axios from "axios"; 

export const getProvinces = () => {
  return axios.get('https://provinces.open-api.vn/api/?depth=1') 
}

export const getDistrictsByProvinceCode = (code: string) => {
  return axios.get(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
}

export const getWards = () => {
  return axios.get("https://provinces.open-api.vn/api/w/");
};

export const getWardsByDistrictCode = (districtCode: string) => {
  return axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
};
