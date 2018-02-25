var expect = require('expect');
var {Users} = require('../utils/users');

describe('User Class', function(){
    
    var users;
    
    beforeEach(function() {
        users = new Users();
        users.usersArr = [
            {
                id: '1',
                name: 'Wael',
                room: 'Basketball'
            },
            {
                id: '2',
                name: 'Yazan',
                room: 'Football'
            },
            {
                id: '3',
                name: 'Ahmad',
                room: 'Basketball'
            },
            {
                id: '4',
                name: 'Hamzah',
                room: 'Football'
            }
        ];
    });
    
    it('should add a user',function(){
        var users = new Users();
        
        var newUser = {
            id: '123',
            name: 'Wael',
            room: 'Basketball'
        };
        
        var resUser = users.addUser(newUser.id,newUser.name,newUser.room);
        
        expect(users.usersArr).toEqual([newUser]);
    });
    

    it('should print array of the names',function(){

        var resArr1 = users.getUserList('Basketball');
        var resArr2 = users.getUserList('Football');

        expect(resArr1).toEqual(['Wael','Ahmad']);
        expect(resArr2).toEqual(['Yazan','Hamzah']);
    });

    it('should print the user with the enered ID',function(){
        var resUser = users.getUser('1');

        expect(resUser).toEqual({
            id: '1',
            name: 'Wael',
            room: 'Basketball'
        });
    });

    it('should remove the user',function(){
        var userId = '2';
        var resUser = users.removeUser(userId);

        expect(resUser.id).toBe(userId);
        expect(users.usersArr.length).toBe(3);
    });

});