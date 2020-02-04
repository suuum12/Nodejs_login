module.exports = (sequelize,DataTypes)=>(
    sequelize.define('user',{
        'email':{
            type:DataTypes.STRING(30),
            allowNull:false,
        },
        'password':{
            type:DataTypes.STRING(100),
            allowNull:false,
        },
        'nick':{
            type:DataTypes.STRING(10),
            allowNull:false,
        }
    })
);