export function signup(req,res){
    const {email,password,fullName}=req.body;

    try {
        if(!email || !password || !fullName){
            res.status(400).json({message:"All field are required"});
        }
        if(password.length < 6){
            res.status(400).json({message:"Password must be at least 6 character"})
        }
        
    } catch (error) {
        
    }
}
export function login(req,res){
    res.send("login");
}
export function logout(req,res){
    res.send("signout");
}