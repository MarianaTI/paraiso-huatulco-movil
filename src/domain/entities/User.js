class User {
    constructor(_id, id_agencia, rol, nombre_comercial, correo) {
        this._id = _id;
        this.id_agencia = id_agencia;
        this.rol = rol;
        this.nombre_comercial = nombre_comercial;
        this.correo = correo;
    }
}

export default User;