class apiFeatures{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString;
    }
    search(){
        const keyWord = this.queryString.keyWord ?{
            name:{
                $regex:this.queryString.keyWord,
                $options:"i"
            }
        }:{}
        console.log(keyWord);
        this.query=this.query.find({...keyWord});
        console.log(this);
        return this;
    }
}

module.exports=apiFeatures;