function registerUser() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    fetch("/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, email })
    })
    .then(res => res.json())
    .then(data => document.getElementById("msg").innerText = data.message);
}

// function sendOTP() {
//     const email = document.getElementById("loginEmail").value;

//     fetch("/send-otp", {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify({ email })
//     })
//     .then(res => res.json())
//     .then(data => document.getElementById("msg").innerText = data.message);
// }

// function verifyOTP() {
//     const email = document.getElementById("loginEmail").value;
//     const otp = document.getElementById("loginOTP").value;

//     fetch("/verify-otp", {
//         method: "POST",
//         headers: {"Content-Type": "application/json"},
//         body: JSON.stringify({ email, otp })
//     })
//     .then(res => res.json())
//     .then(data => {
// if (data.success){window.location.href="/landing"} else {document.getElementById("msg").innerText = data.message}});
// }

function sendOTP() {
    const email = document.getElementById("loginEmail").value;

    fetch("/send-otp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
    .then(res => res.json())
    .then(data => {

        document.getElementById("msg").innerText = data.message;

        if(data.success){
            alert("Your OTP is: " + data.otp);
        }
        .then(res => res.json())
     .then(data => {
 if (data.success){window.location.href="/landing"} else {document.getElementById("msg").innerText = data.message}});
    });
}
function adminLogin(){
    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;
    fetch("/admin/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ user, pass })
    })
    .then(res => res.json())
    .then(data => {
if (data.success){window.location.href="/admindashboard"} else {document.getElementById("msg").innerText = data.message}});

}
function submitNews(){
 fetch("/news",{method:"GET"}).then(data=>{if(data.success){window.location.href="./news"}}) 
}






