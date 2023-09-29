const mongoose=require('mongoose');

const mySchema=mongoose.Schema({
    email: String
});

const News=mongoose.model('News', mySchema);

module.exports=News;
