import IUserRepo from "@/domain/repositories/IUserRepo";

class SignOutUserUseCase {
    constructor(userRepo) {
      if (!(userRepo instanceof IUserRepo))
        throw new Error("userRepo must be instance of IUserRepo");
      this.userRepo = userRepo;
    }
  
    async run() {
      try {
        const signedOut = await this.userRepo.signOut();
        return signedOut;
      } catch (error) {
        console.log("Error signing in user:", error);
        throw error;
      }
    }
  }
  
  export default SignOutUserUseCase;