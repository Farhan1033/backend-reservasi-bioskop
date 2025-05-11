import userRepository from "../Repositories/userRepository.js";

class User {
    constructor(id, name, email, password = null, role, created_at) {
        this.id = id,
        this.name = name,
        this.email = email,
        this.password = password,
        this.role = role,
        this.created_at = created_at
    }

    validate() {
        if (!this.email || !this.email.includes('@')) {
            throw new Error('Email tidak valid!')
        }
        if (!this.name || this.name.length < 2) {
            throw new Error('Nama harus memiliki minimal 2 karakter')
        }
        return true;
    }

    static create(userData){
        return userRepository.createUser(
            userData.id,
            userData.name,
            userData.email,
            userData.password,
            userData.role,
            userData.created_at
        )
    }

    static findById(id){
        return userRepository.findById(id)
    }

    static findByEmail(email){
        return userRepository.findByEmail(email)
    }
}

export default User;