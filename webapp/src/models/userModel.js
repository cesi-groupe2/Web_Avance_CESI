export default class UserModel {
    constructor(id, email, firstname, lastname, role, token) {
      this.id = id;
      this.email = email;
      this.firstname = firstname;
      this.lastname = lastname;
      this.role = role;
      this.token = token;
    }
  
    // Créer une instance de UserModel à partir des données reçues de l'API
    static fromApi(data) {
      return new UserModel(
        data.user.id,
        data.user.email,
        data.user.firstname,
        data.user.lastname,
        data.user.role,
        data.token
      );
    }
  
    // Pour convertir un UserModel en données adaptées à l'API
    toApi() {
      return {
        email: this.email,
        password: this.password,
        firstname: this.firstname,
        lastname: this.lastname,
        role: this.role,
      };
    }
  }
  