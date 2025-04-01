export default interface IAuthService {
  login(email: string, password: string): Promise<string>;
  register(name: string, email: string, password: string): Promise<string>;
}
