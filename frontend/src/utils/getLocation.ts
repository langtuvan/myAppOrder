export function getLocation(provinceCode: any, wardCode: string) {
  if (!provinceCode || !wardCode) {
    return {
      provinceName: "",
      wardName: "",
      fullLocation: "",
    };
  }
  const vietNamLocation = require("@/mock/provinces_and_wards_full.json");
  const { provinces } = vietNamLocation;
  const provinceKey =
    provinceCode < 10 ? `0${provinceCode}` : `${provinceCode}`;
  const province: any = provinces[provinceKey as keyof typeof provinces];
  const wards = provinces[provinceKey as keyof typeof provinces].wards || [];
  const findWard = wards.find((w: any) => w.code === wardCode);
  return {
    provinceName: province?.name,
    wardName: findWard?.name,
    fullLocation: `${findWard?.name}, ${province?.name}, Việt Nam`,
  };
}
