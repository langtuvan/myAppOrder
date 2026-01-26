
export const isUUID = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
export const isMongoId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

//check roomId is mongoose ObjectId format
export const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

