export interface UserInfo {
    id: string;
    email: string;
    userName: string;
    image: string;
    registerTime: string;
    iat: number;
    exp: number;
}

export class User {
    userId: string;
    socketId: string;
    userInfo: UserInfo;

    constructor(userId: string, socketId: string, userInfo: UserInfo) {
        this.userId = userId;
        this.socketId = socketId;
        this.userInfo = userInfo;
    }
}