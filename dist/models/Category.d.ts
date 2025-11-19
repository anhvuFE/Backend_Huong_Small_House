import { Document } from 'mongoose';
export interface ICategory extends Document {
    categoryId: number;
    name: string;
    slug: string;
}
declare const Category: import("mongoose").Model<ICategory, {}, {}, {}, Document<unknown, {}, ICategory, {}, {}> & ICategory & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Category;
//# sourceMappingURL=Category.d.ts.map