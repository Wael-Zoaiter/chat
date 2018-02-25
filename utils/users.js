class Users {
    
    constructor() {
        this.usersArr = []
    }
    
    addUser(id,name,room) {
        var user = {id,name,room};
        this.usersArr.push(user);
        return user;
    }
    
    removeUser(id) {
        var user = this.getUser(id);
        if (user) {
            this.usersArr = this.usersArr.filter( (user) => user.id !== id );
        }
        return user;
    }
    
    getUser(id) {
        var userId = this.usersArr.filter(function(user){
            return user.id === id;
        });
        return userId[0];
        // ES6: return this.usersArr.filter( (user) => user.id === id )[0];
    }
    
    getUserList(room) {
        var users = this.usersArr.filter(function(user) {
            return user.room === room;
        });
        var namesArr = users.map(function(user) {
            return user.name;
        });
        // in ES6 : var users = this.usersArr.filter( (user)=> user.room === room );
        return namesArr;
    }
    
}

module.exports = {Users};