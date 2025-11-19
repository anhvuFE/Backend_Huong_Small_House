import { Schema } from 'mongoose';
declare const Counter: import("mongoose").Model<{
    _id: string;
    seq: number;
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    _id: string;
    seq: number;
}, {}, {
    versionKey: false;
}> & {
    _id: string;
    seq: number;
} & Required<{
    _id: string;
}>, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    versionKey: false;
}, {
    _id: string;
    seq: number;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    _id: string;
    seq: number;
}>, {}, import("mongoose").ResolveSchemaOptions<{
    versionKey: false;
}>> & import("mongoose").FlatRecord<{
    _id: string;
    seq: number;
}> & Required<{
    _id: string;
}>>>;
export default Counter;
//# sourceMappingURL=Counter.d.ts.map