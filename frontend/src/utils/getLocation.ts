export function getLocation(provinceCode: any, wardCode: string) {
  if (!provinceCode || !wardCode) {
    return {
      provinceName: "",
      wardName: "",
      fullLocation: "",
    };
  }
  console.log(
    "getLocation called with provinceCode:",
    provinceCode,
    "wardCode:",
    wardCode,
  );
  const vietNamLocation = require("@/mock/provinces_and_wards_full.json");
  const { provinces } = vietNamLocation;
  // provinceCode =
  //   provinceCode < 10 ? `0${provinceCode}` : `${provinceCode}`;

  const province: any = provinces[provinceCode as keyof typeof provinces];
  const wards = provinces[provinceCode as keyof typeof provinces].wards || [];
  const findWard = wards.find((w: any) => w.code === wardCode);

  return {
    provinceName: province?.name,
    wardName: findWard?.name,
    fullLocation: `${findWard?.name}, ${province?.name}, Việt Nam`,
  };
}
