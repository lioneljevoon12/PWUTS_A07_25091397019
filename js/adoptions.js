$(document).ready(function () {
  var STORAGE_KEY = 'meownesa_adoptions_data';

  function getStoredAdoptions() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return window.defaultAdoptions || [];
  }

  var adoptions = getStoredAdoptions();

  function saveAdoptions() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adoptions));
    } catch (e) {}
  }

  function renderAdoptions(data) {
    var $tbody = $('#adoptionsTableBody');
    $tbody.empty();
    if (!data.length) {
      $tbody.append('<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--ink-muted);">Tidak ada pengajuan adopsi yang sesuai.</td></tr>');
      return;
    }
    data.forEach(function (adp) {
      var badgeClass = adp.status === 'Disetujui' ? 'badge-green' : (adp.status === 'Ditolak' ? 'badge-unsteril' : 'badge-gold');
      var tr = '<tr>' +
        '<td><strong style="color: var(--magenta); font-size: 0.78rem;">' + adp.id + '</strong></td>' +
        '<td>' + adp.date + '</td>' +
        '<td><strong>' + adp.applicant + '</strong></td>' +
        '<td>' + adp.cat + '</td>' +
        '<td>' + adp.domicile + '</td>' +
        '<td><span class="' + badgeClass + '">' + adp.status + '</span></td>' +
        '<td><div style="display: flex; gap: 4px;">' +
          '<button type="button" class="btn-icon btn-detail-adp" data-id="' + adp.id + '" title="Lihat">&#128065;</button>' +
          '<button type="button" class="btn-icon btn-edit-adp" data-id="' + adp.id + '" title="Edit">&#9998;</button>' +
          '<button type="button" class="btn-icon btn-delete-adp" data-id="' + adp.id + '" title="Hapus">&#128465;</button>' +
        '</div></td>' +
      '</tr>';
      $tbody.append(tr);
    });
  }

  function clearErrors() {
    $('.field-error').text('').hide();
    $('.filter-input, .filter-select').removeClass('input-error');
  }

  function showError($field, $err, msg) {
    $field.addClass('input-error');
    $err.text(msg).show();
  }

  function applyFilters() {
    var q = $('#searchAdp').val().toLowerCase().trim();
    var filtered = adoptions.filter(function (a) {
      return !q || a.applicant.toLowerCase().indexOf(q) !== -1 || a.cat.toLowerCase().indexOf(q) !== -1 || a.id.toLowerCase().indexOf(q) !== -1;
    });
    renderAdoptions(filtered);
  }

  $(document).off('.adoptions');

  $(document).on('input.adoptions', '#searchAdp', applyFilters);

  $(document).on('click.adoptions', '.btn-detail-adp', function () {
    var id = $(this).data('id');
    var adp = adoptions.find(function (a) { return a.id === id; });
    if (!adp) return;
    $('#modalAdpId').text(adp.id);
    $('#modalAdpName').text(adp.applicant);
    $('#modalAdpPhone').text(adp.phone);
    $('#modalAdpCat').text(adp.cat);
    $('#modalAdpDomicile').text(adp.domicile);
    $('#modalAdpStatus').text(adp.status);
    $('#modalAdp').fadeIn(200);
  });

  $(document).on('click.adoptions', '#closeModalAdp, #btnCloseModalAdp, #modalAdp', function (e) {
    if (e.target === this) {
      $('#modalAdp').fadeOut(150);
    }
  });

  $(document).on('click.adoptions', '#btnOpenAddAdp', function () {
    clearErrors();
    $('#modalAdpFormTitle').text('Input Pengajuan Adopsi Baru');
    $('#editAdpId').val('');
    $('#editAdpApplicant').val('');
    $('#editAdpPhone').val('');
    $('#editAdpCat').prop('selectedIndex', 0);
    $('#editAdpStatus').val('Review Berkas');
    $('#editAdpDomicile').val('');
    $('#editAdpNotes').val('');
    $('#modalEditAdp').fadeIn(200);
  });

  $(document).on('click.adoptions', '.btn-edit-adp', function () {
    clearErrors();
    var id = $(this).data('id');
    var adp = adoptions.find(function (a) { return a.id === id; });
    if (!adp) return;
    $('#modalAdpFormTitle').text('Ubah Data Pengajuan Adopsi');
    $('#editAdpId').val(adp.id);
    $('#editAdpApplicant').val(adp.applicant);
    $('#editAdpPhone').val(adp.phone);
    $('#editAdpCat').val(adp.cat);
    $('#editAdpStatus').val(adp.status);
    $('#editAdpDomicile').val(adp.domicile);
    $('#editAdpNotes').val(adp.notes || '');
    $('#modalEditAdp').fadeIn(200);
  });

  $(document).on('click.adoptions', '#closeModalEditAdp, #btnCancelEditAdp, #modalEditAdp', function (e) {
    if (e.target === this) {
      $('#modalEditAdp').fadeOut(150);
    }
  });

  $(document).on('submit.adoptions', '#formEditAdp', function (e) {
    e.preventDefault();
    clearErrors();

    var isValid = true;
    var applicant = $('#editAdpApplicant').val().trim();
    var phone = $('#editAdpPhone').val().trim();
    var cat = $('#editAdpCat').val();
    var status = $('#editAdpStatus').val();
    var domicile = $('#editAdpDomicile').val().trim();
    var notes = $('#editAdpNotes').val().trim();

    if (!applicant || applicant.length < 3) {
      showError($('#editAdpApplicant'), $('#errAdpApplicant'), 'Nama pemohon minimal 3 karakter.');
      isValid = false;
    }
    if (!phone || phone.length < 10 || !/^[0-9+\s-]+$/.test(phone)) {
      showError($('#editAdpPhone'), $('#errAdpPhone'), 'Nomor telepon/WA valid minimal 10 digit.');
      isValid = false;
    }
    if (!domicile || domicile.length < 4) {
      showError($('#editAdpDomicile'), $('#errAdpDomicile'), 'Domisili pemohon minimal 4 karakter.');
      isValid = false;
    }
    if (!notes || notes.length < 5) {
      showError($('#editAdpNotes'), $('#errAdpNotes'), 'Catatan screening minimal 5 karakter.');
      isValid = false;
    }

    if (!isValid) return;

    var editId = $('#editAdpId').val();
    if (editId) {
      var target = adoptions.find(function (a) { return a.id === editId; });
      if (target) {
        target.applicant = applicant; target.phone = phone; target.cat = cat;
        target.status = status; target.domicile = domicile; target.notes = notes;
      }
    } else {
      var now = new Date();
      var dateStr = now.toISOString().split('T')[0];
      var newAdp = {
        id: 'ADP-' + String(Math.floor(10000 + Math.random() * 90000)),
        date: dateStr, applicant: applicant, phone: phone,
        cat: cat, status: status, domicile: domicile, notes: notes
      };
      adoptions.unshift(newAdp);
    }

    saveAdoptions();
    applyFilters();
    $('#modalEditAdp').fadeOut(150);
  });

  $(document).on('click.adoptions', '.btn-delete-adp', function () {
    var id = $(this).data('id');
    if (confirm('Yakin ingin menghapus berkas pengajuan ini?')) {
      adoptions = adoptions.filter(function (a) { return a.id !== id; });
      saveAdoptions();
      applyFilters();
    }
  });

  renderAdoptions(adoptions);
});