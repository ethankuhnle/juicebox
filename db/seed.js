const { client, getAllUsers, createUser, updateUser } = require('./index');


async function dropTables(){
    try{
        console.log("Starting to drop tables...");
        await client.query(`
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;`
        );
        console.log("Finished dropping tables!");
    }catch (error){
        console.log("Error when dropping tables!");
        throw error;
    }
}

async function createTables(){
    try{
        console.log("Starting to build tables...");
        await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
            );

        CREATE TABLE posts(
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );
        `);

        console.log("Finished building tables!");
    }catch(error){
        console.log("Error when building tables!");
        throw error;
    }
}

async function createInitialUsers(){
    try{
        console.log("Starting to create users...")

        const albert = await createUser({username:'albert', password:'bertie99', name:'albert', location:'Illinois'})
        console.log(albert);
        const sandra = await createUser({username:'sandra', password:'2sandy4me', name:'sandra', location:'Ohio'})
        console.log(sandra);
        const glamgal = await createUser({username:'glamgal', password:'soglam', name:'glamgal', location:'California'})
        console.log(glamgal);
        console.log("Finished creating users!");
    }catch(error){
        console.error("Error creating users!")
        throw error;
    }
}

async function rebuildDB(){
    try{
        client.connect();
        
        await dropTables();
        await createTables();
        await createInitialUsers();
    }catch (error){
        console.error(error);
    }
}
async function testDB(){
    try{
        console.log("Starting to test database...");

        const users = await getAllUsers();
        console.log("getAllUsers:", users);

        console.log("calling updateUser on users[0]");
        const updateUserResult = await updateUser(users[0].id,{
            name: "Newbert",
            location: "New York"
        });
        console.log("Result:", updateUserResult)

        console.log("Finished database tests!");
    } catch(error){
        console.log("Error testing database!");
        console.error(error);   
    }
}

rebuildDB()
.then(testDB)
.catch(console.error)
.finally(()=> client.end());