$(document).ready(function () {
  var today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  $('#liveDateText').text(today);

  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === '' || currentPage === 'dashboard.html') currentPage = 'index.html';

  $('.sidebar-link').each(function () {
    var href = $(this).attr('href');
    if (href === currentPage) {
      $('.sidebar-link').removeClass('active');
      $(this).addClass('active');
    }
  });

  $('#sidebarToggle, #openAdminSidebarBtn').on('click', function (e) {
    e.stopPropagation();
    $('#sidebar').toggleClass('open');
    $('#sidebarBackdrop').toggleClass('active');
  });

  $('#closeAdminSidebarBtn, #sidebarBackdrop').on('click', function () {
    $('#sidebar').removeClass('open');
    $('#sidebarBackdrop').removeClass('active');
  });

  $('#notifBellBtn').on('click', function (e) {
    e.stopPropagation();
    $('#notifDropdown').toggleClass('active');
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('#notifDropdown, #notifBellBtn').length) {
      $('#notifDropdown').removeClass('active');
    }
  });
});
