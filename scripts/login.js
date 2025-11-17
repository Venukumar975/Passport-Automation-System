// login.js - handle form submit and redirect to applications page
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('login-form');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    // Basic client-side validation can be performed here
    // For now, simply redirect to the applications index page
    window.location.href = './applications.html';
  });
});
