import mongoose from 'mongoose';

/**
 * Hàm localizeDeep - Chuyển đổi dữ liệu đa ngôn ngữ thành ngôn ngữ cụ thể
 *
 * Mục đích:
 * - Duyệt qua toàn bộ object/array một cách đệ quy (deep traversal)
 * - Tìm các field có cấu trúc đa ngôn ngữ như: { en: "Hello", vi: "Xin chào" }
 * - Trích xuất giá trị của ngôn ngữ được chỉ định (locale)
 *
 * Ví dụ:
 * Input: { name: { en: "Product", vi: "Sản phẩm" }, price: 100 }
 * locale: "vi"
 * Output: { name: "Sản phẩm", price: 100 }
 */
export function localizeDeep(data: any, locale: string) {
  // Trường hợp 1: Nếu data là mảng
  // => Áp dụng localizeDeep cho từng phần tử trong mảng
  if (Array.isArray(data)) {
    return data.map((item) => localizeDeep(item, locale));
  }

  // Trường hợp 2: Nếu data là object (không phải null)
  // Kiểm tra thêm nếu là MongoDB ObjectId hoặc Date thì trả về nguyên giá trị
  if (data && typeof data === 'object') {
    // Bỏ qua ObjectId và Date (không xử lý đệ quy)
    const output: any = {};

    // Duyệt qua tất cả các key trong object
    for (const key of Object.keys(data)) {
      const value = data[key];



      // Kiểm tra xem value có phải là object đa ngôn ngữ không
      // VD: { en: "Hello", vi: "Xin chào" }
      if (value && typeof value === 'object' && value[locale]) {
        // Lấy giá trị theo locale, nếu không có thì fallback sang 'en'
        output[key] = value[locale] ?? value['en'];
      }
      // Nếu value là mảng, đệ quy xử lý từng phần tử
      else if (Array.isArray(value)) {
        output[key] = value.map((item) => localizeDeep(item, locale));
      }
      // Nếu là object khác hoặc giá trị đơn, tiếp tục đệ quy
      else {
        output[key] = localizeDeep(value, locale);
      }
    }

    return output;
  }

  if (mongoose.Types.ObjectId.isValid(data)) {

    return convertObjectId(data);
  }
  // Trường hợp 3: Giá trị nguyên thủy (string, number, boolean, null)
  // => Trả về nguyên giá trị
  return data;
}

export function convertObjectId(obj: any) {
  if (obj && obj._bsontype === 'ObjectId') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertObjectId);
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, convertObjectId(v)]),
    );
  }

  return obj;
}
