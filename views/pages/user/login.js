$(document).ready(function () {
  $(".login-register").click(function () {
    $('.login-card').hide()
    $('.forgot-password-card').hide();
    $('.register-card').show();
  });
  $(".register-login").click(function () {
    $('.register-card').hide()
    $('.forgot-password-card').hide();
    $('.login-card').show();
  });
  $(".forgot-password").click(function () {
    $('.login-card').hide()
    $('.register-card').hide()
    $('.forgot-password-card').show();
  });

  // $('#inputEmail-error').css("color", "red");
  //Login Code
  $("#btnLogin").click(function () {
    var validation = formValidation('frmLogin');
    if (validation == true) {
      var data = {};
      data.email = $("#inputEmail").val();
      data.password = $("#inputPassword").val();
      Api.post(Constants.Api.signin, null, data, function (error, res) {
        if (res != undefined && res.status == true) {
          $.cookie('Authorization', res.access_token);
          var redirectUrl=res.data[0].module_name;
          if (window.location.pathname == undefined || window.location.pathname == "/")
            window.location.href = "/"+redirectUrl;
          else
            window.location.href = window.location.pathname;
        } else if (error.status == false) {
          $("#btnError").attr("data-message", error.error.message);
          $('#btnError').click();
          $("#inputEmail").focus();
        }
      });
    }
  });

  //Sign Up code
  $("#btnSignup").click(function () {
    var validation = formValidation('validationForm');
    var password1 = $("#txtPwd1").val();
    var password2 = $("#txtPwd2").val();
    if (password1 != password2) {
      $("#btnError").attr("data-message", "Password Not Match");
      $('#btnError').click();
      $("#txtPwd1").focus();
    } else {
      if (validation == true) {
        var data = {};
        data.name = $("#txtUserName").val();
        data.email = $("#txtEmail").val();
        data.country_code = '+91';
        data.number = $('#txtNumber').val();
        data.email = $("#txtEmail").val();
        data.password = $("#txtPwd2").val();

        Api.post(Constants.Api.signup, null, data, function (error, res) {
          if (res != undefined && res.status == true) {
            $("#btnSuccess").attr("data-message", res.data.message);
            $("#btnSuccess").click();
            $('.form-control').val("");
            $('.form-control').focusout();
            $(".login-card").show();
            $(".register-card").hide();
          } else if (error.status == false) {
            if(error.error.code==9000){
              $("#btnError").attr("data-message", "Email id is already exists.");
            $('#btnError').click();
            }else{
            $("#btnError").attr("data-message", error.error.message);
            $('#btnError').click();
            $('.form-control').val("");
            }
            
          }
        });
      }

    }
  });

  $('#inputPassword').keypress(function (e) {
    if (e.keyCode == 13) {
      $("#btnLogin").trigger("click");
    }
  });
});
