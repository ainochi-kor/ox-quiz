import { UserCredential } from "firebase/auth";

class UserStore {
  private static instance: UserStore;
  private state: UserCredential | null;

  private constructor() {
    this.state = null;
  }

  public static getInstance(): UserStore {
    if (!UserStore.instance) {
      UserStore.instance = new UserStore();
    }
    return UserStore.instance;
  }

  public getState() {
    return this.state;
  }

  public setState(newState: UserCredential) {
    this.state = Object.assign({}, this.state, newState);
  }
}

const userStore = UserStore.getInstance();
export default userStore;
