/* GET homepage */
const loginForm = async (req, res) => {
    let user = req.params.user;
    console.log("user", user);
    if(!user){
        user = false
    }else{
        user = true;
    }
    res.render('pages/loginForm', {error: false, 
        errorMessage: "", user: user})
};

module.exports = {
    loginForm
}