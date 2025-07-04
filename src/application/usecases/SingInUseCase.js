import IUserRepo from "@/domain/repositories/IUserRepo";

class SignInUserUseCase {
    constructor(userRepo) {
      if (!(userRepo instanceof IUserRepo))
        throw new Error("userRepo must be instance of IUserRepo");
      this.userRepo = userRepo;
    }
  
    async run(user) {
      try {
        const signedIn = await this.userRepo.signIn(user);
        return signedIn;
      } catch (error) {
        console.log("Error signing in user:", error);
        throw error;
      }
    }
  }
  
  export default SignInUserUseCase;