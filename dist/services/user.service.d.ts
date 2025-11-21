import { IUser } from '../models/User';
interface ListUsersQuery {
    status?: IUser['status'];
    keyword?: string;
}
declare class UserService {
    listUsers(query: ListUsersQuery): Promise<IUser[]>;
    getByUserId(userId: number): Promise<IUser>;
    updateStatus(userId: number, status: IUser['status']): Promise<IUser>;
}
declare const _default: UserService;
export default _default;
//# sourceMappingURL=user.service.d.ts.map