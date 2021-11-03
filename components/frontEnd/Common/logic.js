
function Logout() {
  localStorage.clear();
  window.location.href = "/";
}

async function AcceptAllocation(studentId, adminId) {
  var data = "student=" + studentId + "&admin=" + adminId;
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