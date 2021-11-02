
function Logout() {
  localStorage.clear();
  window.location.href = "/";
}

async function AcceptAllocation(studentId, adminId) {

console.log("here");
  var data = "student=" + studentId + "&admin=" + adminId;
  console.log(data);
  await $.ajax({
    type: "GET",
    data: data,
    url: "/accept",
    cache: false,
    success: (data) => {
      if (data == true) {
        //alert('student accepted succesfully');
      } else {
        alert('Process Failed');
      }
    }
  })

  //refreshData();
}